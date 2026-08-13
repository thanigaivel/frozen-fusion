import { v2 as cloudinary } from "cloudinary";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Missing Cloudinary environment variables"
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  categoryName: string
): Promise<string> {
  const folderName =
    `frozen-fusion/products/${categoryName.replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    )}`;

  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result?.secure_url) {
            reject(
              new Error(
                "Cloudinary did not return an image URL"
              )
            );
            return;
          }

          resolve(result.secure_url);
        }
      );

    uploadStream.end(buffer);
  });
}

/**
 * Extract Cloudinary public_id from a Cloudinary URL.
 *
 * Example:
 *
 * https://res.cloudinary.com/demo/image/upload/v123456/frozen-fusion/products/Kulfi/test.jpg
 *
 * becomes:
 *
 * frozen-fusion/products/Kulfi/test
 */
export function getCloudinaryPublicId(
  imageUrl: string
): string | null {
  try {
    if (!imageUrl) {
      return null;
    }

    const url = new URL(imageUrl);

    // Example:
    // /pkdupslt/image/upload/v1786592348/
    // frozen-fusion/products/Kulfi_Varieties/file.jpg

    const uploadIndex =
      url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      console.error(
        "[CLOUDINARY] /upload/ not found in URL:",
        imageUrl
      );

      return null;
    }

    // Everything after /upload/
    let path =
      url.pathname.substring(
        uploadIndex + "/upload/".length
      );

    console.log(
      "[CLOUDINARY] Path after /upload/:",
      path
    );

    const parts = path.split("/");

    /*
     * Remove Cloudinary version:
     *
     * v1786592348
     */
    if (
      parts.length > 0 &&
      /^v\d+$/.test(parts[0])
    ) {
      parts.shift();
    }

    /*
     * Remove file extension.
     */
    let publicId =
      parts.join("/");

    publicId =
      publicId.replace(
        /\.(jpg|jpeg|png|webp|gif|avif)$/i,
        ""
      );

    console.log(
      "[CLOUDINARY] Extracted Public ID:",
      publicId
    );

    return publicId || null;
  } catch (error) {
    console.error(
      "[CLOUDINARY] Public ID extraction failed:",
      error
    );

    return null;
  }
}


export async function deleteFromCloudinary(
  imageUrl: string
): Promise<boolean> {
  try {
    console.log(
      "========================================"
    );

    console.log(
      "[CLOUDINARY DELETE] Starting..."
    );

    console.log(
      "[CLOUDINARY DELETE] URL:",
      imageUrl
    );

    const publicId =
      getCloudinaryPublicId(imageUrl);

    if (!publicId) {
      console.error(
        "[CLOUDINARY DELETE] Could not determine public ID"
      );

      return false;
    }

    console.log(
      "[CLOUDINARY DELETE] Public ID:",
      publicId
    );

    const result =
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image",
          type: "upload",
          invalidate: true,
        }
      );

    console.log(
      "[CLOUDINARY DELETE] Cloudinary response:",
      JSON.stringify(result)
    );

    if (result.result === "ok") {
      console.log(
        "[CLOUDINARY DELETE] SUCCESS - Old image deleted"
      );

      return true;
    }

    if (result.result === "not found") {
      console.warn(
        "[CLOUDINARY DELETE] Asset not found:",
        publicId
      );

      return false;
    }

    console.error(
      "[CLOUDINARY DELETE] Unexpected result:",
      result.result
    );

    return false;
  } catch (error) {
    console.error(
      "[CLOUDINARY DELETE] ERROR:",
      error
    );

    return false;
  } finally {
    console.log(
      "========================================"
    );
  }
}

export default cloudinary;