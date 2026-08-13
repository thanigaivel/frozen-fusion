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

    if (
      !imageUrl.includes("res.cloudinary.com") ||
      !imageUrl.includes("/upload/")
    ) {
      return null;
    }

    const uploadPart =
      imageUrl.split("/upload/")[1];

    if (!uploadPart) {
      return null;
    }

    const parts = uploadPart.split("/");

    /*
     * Find the Cloudinary version:
     *
     * v1786602553
     */
    const versionIndex =
      parts.findIndex((part) =>
        /^v\d+$/.test(part)
      );

    let publicIdParts: string[];

    if (versionIndex !== -1) {
      publicIdParts =
        parts.slice(versionIndex + 1);
    } else {
      /*
       * If there is no version, remove possible
       * transformation segments as best as possible.
       */
      publicIdParts = parts;
    }

    if (publicIdParts.length === 0) {
      return null;
    }

    let publicId =
      publicIdParts.join("/");

    /*
     * Remove file extension.
     *
     * test.jpg → test
     */
    publicId =
      publicId.replace(
        /\.(jpg|jpeg|png|webp|gif|avif)$/i,
        ""
      );

    return publicId || null;
  } catch (error) {
    console.error(
      "[CLOUDINARY] Failed to extract public ID:",
      error
    );

    return null;
  }
}

/**
 * Delete an image from Cloudinary.
 */
export async function deleteFromCloudinary(
  imageUrl: string
): Promise<boolean> {
  try {
    const publicId =
      getCloudinaryPublicId(imageUrl);

    if (!publicId) {
      console.log(
        "[CLOUDINARY DELETE] Invalid or non-Cloudinary URL:",
        imageUrl
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
      "[CLOUDINARY DELETE] Result:",
      result
    );

    return (
      result.result === "ok" ||
      result.result === "not found"
    );
  } catch (error) {
    console.error(
      "[CLOUDINARY DELETE ERROR]",
      error
    );

    return false;
  }
}

export default cloudinary;