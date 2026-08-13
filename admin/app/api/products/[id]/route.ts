import { NextResponse } from "next/server";

import {
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
} from "@/lib/products-db";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary";

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

// ============================================================
// PATCH PRODUCT
// ============================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let newUploadedImageUrl: string | null = null;

  try {
    const { id } = await params;

    console.log(
      "===================================="
    );

    console.log(
      "[PRODUCTS PATCH] Product ID:",
      id
    );

    // ========================================================
    // GET CURRENT PRODUCT
    // ========================================================

    const existingProduct =
      await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const oldImageUrl =
      existingProduct.image || "";

    console.log(
      "[PRODUCTS PATCH] Existing image:",
      oldImageUrl || "NO IMAGE"
    );

    const contentType =
      request.headers.get("content-type") || "";

    let updateData: Record<string, any> = {};

    // ========================================================
    // MULTIPART FORM DATA
    // ========================================================

    if (
      contentType.includes(
        "multipart/form-data"
      )
    ) {
      const formData =
        await request.formData();

      const file =
        formData.get("image");

      const categoryName =
        (formData.get(
          "categoryName"
        ) as string) || "general";

      // ======================================================
      // READ FORM FIELDS
      // ======================================================

      formData.forEach(
        (value, key) => {
          /*
           * NEVER directly copy image.
           *
           * Image is handled separately below.
           */
          if (key === "image") {
            return;
          }

          /*
           * imageUrl is no longer required.
           *
           * We use only `image` in MongoDB.
           */
          if (key === "imageUrl") {
            return;
          }

          if (key === "rating") {
            const rating =
              parseFloat(
                value as string
              );

            if (!Number.isNaN(rating)) {
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

          updateData[key] = value;
        }
      );

      // ======================================================
      // CHECK FOR NEW IMAGE
      // ======================================================

      const hasNewImage =
        file instanceof File &&
        file.size > 0;

      if (hasNewImage) {
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

        // ====================================================
        // UPLOAD NEW IMAGE
        // ====================================================

        try {
          const bytes =
            await file.arrayBuffer();

          const buffer =
            Buffer.from(bytes);

          newUploadedImageUrl =
            await uploadToCloudinary(
              buffer,
              categoryName
            );

          console.log(
            "[PRODUCTS PATCH] NEW CLOUDINARY URL:",
            newUploadedImageUrl
          );

          /*
           * IMPORTANT:
           *
           * MongoDB has only ONE image field.
           */
          updateData.image =
            newUploadedImageUrl;
        } catch (uploadError: any) {
          console.error(
            "[PRODUCTS PATCH] Cloudinary upload failed:",
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
        // ====================================================
        // NO NEW IMAGE
        // ====================================================

        /*
         * VERY IMPORTANT:
         *
         * Do NOT send:
         *
         * image: ""
         *
         * when the admin only changes description,
         * rating, tags, etc.
         *
         * MongoDB will therefore preserve the old image.
         */
        delete updateData.image;

        console.log(
          "[PRODUCTS PATCH] No new image - preserving existing image"
        );
      }
    }

    // ========================================================
    // JSON REQUEST
    // ========================================================

    else {
      updateData =
        await request.json();

      /*
       * Prevent empty image from deleting
       * an existing valid image.
       */
      if (
        updateData.image === ""
      ) {
        delete updateData.image;
      }
    }

    // ========================================================
    // VISIBILITY ONLY
    // ========================================================

    if (
      updateData.visible !==
      undefined &&
      Object.keys(updateData).length ===
      1
    ) {
      await toggleProductVisibility(
        id,
        updateData.visible
      );

      console.log(
        "[PRODUCTS PATCH] Visibility updated"
      );
    }

    // ========================================================
    // NORMAL UPDATE
    // ========================================================

    else {
      console.log(
        "[PRODUCTS DB UPDATE] START"
      );

      console.log(
        "[PRODUCTS DB UPDATE] Product ID:",
        id
      );

      console.log(
        "[PRODUCTS DB UPDATE] Image:",
        updateData.image ||
        "NO IMAGE CHANGE"
      );

      console.log(
        "[PRODUCTS DB UPDATE] Fields:",
        Object.keys(updateData)
      );

      await updateProduct(
        id,
        updateData
      );

      console.log(
        "[PRODUCTS DB UPDATE] MongoDB update completed"
      );
    }

    // ========================================================
    // DELETE OLD CLOUDINARY IMAGE
    // ========================================================

    /*
     * ONLY delete the old image if:
     *
     * 1. A new image was uploaded
     * 2. MongoDB update succeeded
     * 3. Old image exists
     * 4. Old and new URLs are different
     */

    if (
      newUploadedImageUrl &&
      oldImageUrl &&
      oldImageUrl !==
      newUploadedImageUrl
    ) {
      console.log(
        "[PRODUCTS PATCH] Deleting old Cloudinary image..."
      );

      const deleted =
        await deleteFromCloudinary(
          oldImageUrl
        );

      if (deleted) {
        console.log(
          "[PRODUCTS PATCH] Old Cloudinary image deleted successfully"
        );
      } else {
        console.warn(
          "[PRODUCTS PATCH] Old Cloudinary image could not be deleted"
        );
      }
    }

    console.log(
      "[PRODUCTS PATCH] Completed successfully"
    );

    console.log(
      "===================================="
    );

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

    // ========================================================
    // CLEAN UP NEW IMAGE IF DATABASE UPDATE FAILED
    // ========================================================

    /*
     * If Cloudinary upload succeeded but MongoDB failed,
     * remove the newly uploaded image.
     *
     * This prevents unused images accumulating in Cloudinary.
     */

    if (newUploadedImageUrl) {
      console.log(
        "[PRODUCTS PATCH] Database update failed."
      );

      console.log(
        "[PRODUCTS PATCH] Cleaning up newly uploaded image..."
      );

      await deleteFromCloudinary(
        newUploadedImageUrl
      );
    }

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

// ============================================================
// DELETE PRODUCT
// ============================================================

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingProduct =
      await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    // ========================================================
    // DELETE PRODUCT FROM MONGODB
    // ========================================================

    await deleteProduct(id);

    // ========================================================
    // DELETE IMAGE FROM CLOUDINARY
    // ========================================================

    if (existingProduct.image) {
      console.log(
        "[PRODUCT DELETE] Deleting Cloudinary image..."
      );

      await deleteFromCloudinary(
        existingProduct.image
      );
    }

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