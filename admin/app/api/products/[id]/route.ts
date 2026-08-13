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
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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

    const contentType =
      request.headers.get("content-type") || "";

    let updateData: Record<string, any> = {};

    // =========================================================
    // MULTIPART FORM DATA
    // =========================================================

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const file = formData.get("image");

      const categoryName =
        (formData.get("categoryName") as string) ||
        "general";

      // -------------------------------------------------------
      // Read normal fields
      // -------------------------------------------------------

      formData.forEach((value, key) => {
        // NEVER directly update image from the form.
        //
        // The image field must only be changed after:
        // 1. A real file is uploaded
        // 2. OR a valid imageUrl is supplied
        //
        if (key === "image") {
          return;
        }

        if (key === "rating") {
          const rating = parseFloat(value as string);

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

        // -----------------------------------------------------
        // IMPORTANT:
        // imageUrl is handled separately below.
        // -----------------------------------------------------

        if (key === "imageUrl") {
          return;
        }

        updateData[key] = value;
      });

      // =======================================================
      // IMAGE HANDLING
      // =======================================================

      // Check if an actual file was uploaded.
      const hasFile =
        file instanceof File &&
        file.size > 0;

      if (hasFile) {
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

          const cloudinaryUrl =
            await uploadToCloudinary(
              buffer,
              categoryName
            );

          console.log(
            "[PRODUCTS PATCH] NEW CLOUDINARY URL:",
            cloudinaryUrl
          );

          // ---------------------------------------------------
          // IMPORTANT:
          // Save the URL into `image`.
          // ---------------------------------------------------

          updateData.image =
            cloudinaryUrl;

          // Optional backward compatibility.
          // This keeps old frontend/admin code working.
          updateData.imageUrl =
            cloudinaryUrl;
        } catch (uploadError: any) {
          console.error(
            "[PRODUCTS PATCH] Cloudinary Upload Error:",
            uploadError
          );

          return NextResponse.json(
            {
              error:
                `Cloudinary upload failed: ${uploadError?.message ||
                "Unknown error"
                }`,
            },
            {
              status: 500,
              headers: corsHeaders,
            }
          );
        }
      } else {
        // =====================================================
        // NO NEW IMAGE
        // =====================================================

        const submittedImageUrl =
          formData.get("imageUrl");

        /*
         * If admin sends an existing image URL,
         * use it as the canonical `image` value.
         *
         * This fixes your current products where:
         *
         * image: ""
         * imageUrl: "https://..."
         */

        if (
          typeof submittedImageUrl === "string" &&
          submittedImageUrl.trim() !== ""
        ) {
          updateData.image =
            submittedImageUrl.trim();

          updateData.imageUrl =
            submittedImageUrl.trim();

          console.log(
            "[PRODUCTS PATCH] Existing image URL preserved:",
            submittedImageUrl
          );
        } else {
          /*
           * IMPORTANT:
           *
           * Do NOT send image: "".
           *
           * If the admin is only changing the description,
           * MongoDB must keep the existing image.
           */
          delete updateData.image;
          delete updateData.imageUrl;

          console.log(
            "[PRODUCTS PATCH] No image change"
          );
        }
      }
    }

    // =========================================================
    // JSON REQUEST
    // =========================================================

    else {
      updateData = await request.json();

      /*
       * If JSON contains imageUrl but not image,
       * normalize it to image.
       */

      if (
        (!updateData.image ||
          updateData.image === "") &&
        typeof updateData.imageUrl === "string" &&
        updateData.imageUrl.trim() !== ""
      ) {
        updateData.image =
          updateData.imageUrl.trim();
      }

      /*
       * Never allow an empty image to overwrite
       * an existing valid image.
       */
      if (
        updateData.image === ""
      ) {
        delete updateData.image;
      }
    }

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
    }

    // =========================================================
    // NORMAL UPDATE
    // =========================================================

    else {
      console.log(
        "===================================="
      );

      console.log(
        "[PRODUCTS PATCH] Updating product:",
        id
      );

      console.log(
        "[PRODUCTS PATCH] Fields:",
        Object.keys(updateData)
      );

      console.log(
        "[PRODUCTS PATCH] Image:",
        updateData.image ||
        "NO IMAGE CHANGE"
      );

      await updateProduct(
        id,
        updateData
      );
    }

    // =========================================================
    // RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,
        data: updateData,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error(
      "[PRODUCTS PATCH ERROR]",
      error
    );

    return NextResponse.json(
      {
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
// DELETE
// =============================================================

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteProduct(id);

    return NextResponse.json(
      {
        success: true,
      },
      {
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