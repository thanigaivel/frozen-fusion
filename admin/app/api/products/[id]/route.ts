import { NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
} from "@/lib/products-db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID is required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const contentType =
      request.headers.get("content-type") || "";

    let updateData: Record<string, any> = {};

    // =========================================================
    // MULTIPART FORM DATA
    // =========================================================

    if (
      contentType.includes("multipart/form-data")
    ) {
      const formData =
        await request.formData();

      const file =
        formData.get("image") as File | null;

      const categoryName =
        (formData.get("categoryName") as string) ||
        "general";

      // Read form fields
      formData.forEach((value, key) => {
        // Image is handled separately
        if (key === "image") {
          return;
        }

        /*
         * IMPORTANT:
         * Ignore imageUrl coming from the frontend.
         *
         * We will generate imageUrl from the NEW
         * Cloudinary URL below.
         */
        if (key === "imageUrl") {
          return;
        }

        if (key === "rating") {
          const rating = parseFloat(
            value as string
          );

          if (!Number.isNaN(rating)) {
            updateData.rating = rating;
          }

          return;
        }

        if (key === "tags") {
          try {
            updateData.tags = JSON.parse(
              value as string
            );
          } catch {
            updateData.tags = [];
          }

          return;
        }

        if (key === "visible") {
          updateData.visible =
            value !== "false";

          return;
        }

        updateData[key] = value;
      });

      // =======================================================
      // UPLOAD NEW IMAGE
      // =======================================================

      if (file && file.size > 0) {
        console.log(
          "[PRODUCTS PATCH] New image received"
        );

        console.log(
          "[PRODUCTS PATCH] File:",
          file.name
        );

        console.log(
          "[PRODUCTS PATCH] Size:",
          file.size,
          "bytes"
        );

        try {
          const bytes =
            await file.arrayBuffer();

          const buffer =
            Buffer.from(bytes);

          const newImageUrl =
            await uploadToCloudinary(
              buffer,
              categoryName
            );

          if (!newImageUrl) {
            throw new Error(
              "Cloudinary did not return an image URL."
            );
          }

          console.log(
            "[PRODUCTS PATCH] NEW CLOUDINARY URL:",
            newImageUrl
          );

          /*
           * IMPORTANT
           *
           * Keep both fields synchronized.
           */
          updateData.image =
            newImageUrl;

          updateData.imageUrl =
            newImageUrl;
        } catch (uploadError: any) {
          console.error(
            "[PRODUCTS PATCH] Cloudinary Upload Error:",
            uploadError
          );

          return NextResponse.json(
            {
              success: false,
              error: `Cloudinary upload failed: ${uploadError?.message ||
                "Unknown error"
                }`,
            },
            {
              status: 500,
              headers: corsHeaders,
            }
          );
        }
      }
    } else {
      // =======================================================
      // JSON UPDATE
      // =======================================================

      updateData =
        await request.json();

      /*
       * If JSON contains image but imageUrl is missing,
       * keep both fields synchronized.
       */
      if (
        updateData.image &&
        !updateData.imageUrl
      ) {
        updateData.imageUrl =
          updateData.image;
      }

      /*
       * If frontend sends imageUrl as the new URL,
       * synchronize image as well.
       */
      if (
        updateData.imageUrl &&
        !updateData.image
      ) {
        updateData.image =
          updateData.imageUrl;
      }
    }

    // =========================================================
    // VALIDATE
    // =========================================================

    if (
      Object.keys(updateData).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No fields provided for update.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    console.log(
      "[PRODUCTS PATCH] Product ID:",
      id
    );

    console.log(
      "[PRODUCTS PATCH] Fields:",
      Object.keys(updateData)
    );

    // =========================================================
    // VISIBILITY ONLY
    // =========================================================

    if (
      updateData.visible !== undefined &&
      Object.keys(updateData).length === 1
    ) {
      await toggleProductVisibility(
        id,
        updateData.visible
      );
    } else {
      // =======================================================
      // UPDATE MONGODB
      // =======================================================

      await updateProduct(
        id,
        updateData
      );
    }

    console.log(
      "[PRODUCTS PATCH] MongoDB update completed for",
      id
    );

    return NextResponse.json(
      {
        success: true,
        id,
        data: updateData,
        imageUrl:
          updateData.imageUrl ||
          updateData.image ||
          null,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error(
      "[PRODUCTS PATCH ERROR]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to update product.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// =============================================================
// DELETE PRODUCT
// =============================================================

export async function DELETE(
  _: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Product ID is required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    await deleteProduct(id);

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error(
      "[PRODUCTS DELETE ERROR]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to delete product.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}