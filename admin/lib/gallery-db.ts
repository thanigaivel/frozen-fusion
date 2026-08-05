import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  uploadedAt: Date;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const images = await db
      .collection("gallery")
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();

    return images.map((img) => ({
      ...img,
      _id: img._id.toString(),
    })) as GalleryImage[];
  } catch (error) {
    console.error("[GET GALLERY ERROR]", error);
    return [];
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    
    // First find the image to get the URL before deleting
    const image = await db.collection("gallery").findOne({ _id: new ObjectId(id) });
    if (!image) return { success: false, error: "Image not found" };

    const result = await db.collection("gallery").deleteOne({ _id: new ObjectId(id) });
    
    return { success: result.deletedCount === 1, imageUrl: image.imageUrl };
  } catch (error) {
    console.error("[DELETE GALLERY ERROR]", error);
    return { success: false, error: "Database error" };
  }
}
