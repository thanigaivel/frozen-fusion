import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  outletName?: string;
  outletSlug?: string;
  imageUrl: string;
  uploadedAt: Date;
}

export function slugify(text: string): string {
  return (text || "general")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function getGalleryImages(outletSlug?: string): Promise<GalleryImage[]> {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const query = outletSlug && outletSlug !== "all" ? { outletSlug } : {};
    const images = await db
      .collection("gallery")
      .find(query)
      .sort({ uploadedAt: -1 })
      .toArray();

    return images.map((img) => ({
      ...img,
      _id: img._id.toString(),
      outletName: img.outletName || "Tuticorin Flagship Lounge",
      outletSlug: img.outletSlug || slugify(img.outletName || "Tuticorin Flagship Lounge"),
    })) as GalleryImage[];
  } catch (error) {
    console.error("[GET GALLERY ERROR]", error);
    return [];
  }
}

export async function createGalleryImages(
  entries: Array<{
    title: string;
    description?: string;
    outletName: string;
    outletSlug: string;
    imageUrl: string;
  }>
) {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const now = new Date();
    const docs = entries.map((e) => ({
      ...e,
      uploadedAt: now,
    }));
    const result = await db.collection("gallery").insertMany(docs);
    return { success: true, count: result.insertedCount };
  } catch (error) {
    console.error("[CREATE GALLERY ERROR]", error);
    throw error;
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    
    const image = await db.collection("gallery").findOne({ _id: new ObjectId(id) });
    if (!image) return { success: false, error: "Image not found" };

    const result = await db.collection("gallery").deleteOne({ _id: new ObjectId(id) });
    
    return { success: result.deletedCount === 1, imageUrl: image.imageUrl };
  } catch (error) {
    console.error("[DELETE GALLERY ERROR]", error);
    return { success: false, error: "Database error" };
  }
}
