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

    /* =========================================================
       MULTIPART FORM DATA
       Used when admin uploads a new image
    ========================================================= */

    if (
      contentType.includes(
        "multipart/form-data"
      )
    ) {
      const formData =
        await request.formData();

      const file =
        formData.get("image") as
        | File
        | null;

      const categoryName =
        (formData.get(
          "categoryName"
        ) as string) || "general";

      /* -------------------------------------------------------
         Read normal form fields
      ------------------------------------------------------- */

      formData.forEach(
        (value, key) => {
          // Image is handled separately below
          if (key === "image") {
            return;
          }

          if (
            key === "rating"
          ) {
            const rating =
              parseFloat(
                value as string
              );

            if (
              !Number.isNaN(rating)
            ) {
              updateData.rating =
                rating;
            }

            return;
          }

          if (key === "tags") {
            try {
              updateData.tags =
                JSON.parse(
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

          updateData[key] =
            value;
        }
      );

      /* -------------------------------------------------------
         Upload NEW image to Cloudinary
      ------------------------------------------------------- */

      if (
        file &&
        file.size > 0
      ) {
        console.log(
          `[PRODUCTS PATCH] New image received`
        );

        console.log(
          `[PRODUCTS PATCH] File: ${file.name}`
        );

        console.log(
          `[PRODUCTS PATCH] Size: ${file.size} bytes`
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

          /*
           * IMPORTANT:
           * This is the value that will be
           * stored in MongoDB.
           */
          updateData.image =
            newImageUrl;

          console.log(
            `[PRODUCTS PATCH] NEW CLOUDINARY URL: ${newImageUrl}`
          );
        } catch (
        uploadError: any
        ) {
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
      /* =======================================================
         JSON UPDATE
      ======================================================= */

      updateData =
        await request.json();
    }

    /* =========================================================
       VALIDATE UPDATE
    ========================================================= */

    if (
      Object.keys(updateData)
        .length === 0
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
      `[PRODUCTS PATCH] Product ID: ${id}`
    );

    console.log(
      "[PRODUCTS PATCH] Fields:",
      Object.keys(updateData)
    );

    /* =========================================================
       VISIBILITY ONLY UPDATE
    ========================================================= */

    if (
      updateData.visible !==
      undefined &&
      Object.keys(updateData)
        .length === 1
    ) {
      await toggleProductVisibility(
        id,
        updateData.visible
      );
    } else {
      /* =======================================================
         NORMAL PRODUCT UPDATE
         This includes the NEW Cloudinary URL
      ======================================================= */

      await updateProduct(
        id,
        updateData
      );
    }

    console.log(
      `[PRODUCTS PATCH] MongoDB update completed for ${id}`
    );

    /* =========================================================
       RESPONSE
    ========================================================= */

    return NextResponse.json(
      {
        success: true,
        id,
        data: updateData,

        /*
         * Useful for debugging.
         */
        imageUpdated:
          typeof updateData.image ===
          "string",

        imageUrl:
          updateData.image ||
          null,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,

          /*
           * Prevent browser/proxy caching
           * of the PATCH response.
           */
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

/* =============================================================
   DELETE PRODUCT
============================================================= */

export async function DELETE(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

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