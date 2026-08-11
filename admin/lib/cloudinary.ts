import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const url = (process.env.CLOUDINARY_URL || "").trim().replace(/\r/g, "").replace(/^["']|["']$/g, "");
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim().replace(/\r/g, "");
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim().replace(/\r/g, "");
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim().replace(/\r/g, "");

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }

  if (url) {
    const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@([^/?#]+)/);
    if (match) {
      cloudinary.config({
        api_key: match[1].trim(),
        api_secret: match[2].trim(),
        cloud_name: match[3].trim(),
        secure: true,
      });
      return true;
    } else {
      cloudinary.config({
        cloudinary_url: url,
        secure: true,
      });
      return true;
    }
  }

  return false;
}

export async function uploadToCloudinary(buffer: Buffer, categoryName: string): Promise<string> {
  const configured = configureCloudinary();
  if (!configured) {
    throw new Error(
      "Cloudinary credentials are not configured. Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables."
    );
  }

  // Sanitize folder name
  const safeCategory = (categoryName || "general").replace(/[^a-zA-Z0-9_-]/g, "_");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `frozen-fusion/products/${safeCategory}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("No URL returned from Cloudinary response."));
        }
      }
    );
    uploadStream.end(buffer);
  });
}
