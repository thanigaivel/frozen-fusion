import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface ProductDoc {
  _id?: ObjectId;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  badge: string | null;
  rating: number;
  image: string;
  color: string;
  tags: string[];
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get products
 *
 * Optional categoryId filter.
 */
export async function getProducts(categoryId?: string) {
  const client = await clientPromise;
  const db = client.db("frozenfusion");

  const query = categoryId
    ? { categoryId }
    : {};

  const docs = await db
    .collection<ProductDoc>("products")
    .find(query)
    .project({
      name: 1,
      categoryId: 1,
      categoryName: 1,
      description: 1,
      badge: 1,
      rating: 1,
      image: 1,
      color: 1,
      tags: 1,
      visible: 1,
      createdAt: 1,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) => ({
    ...doc,
    _id: doc._id?.toString(),
  }));
}

/**
 * Create product
 */
export async function createProduct(
  data: Omit<ProductDoc, "_id" | "createdAt" | "updatedAt">
) {
  const client = await clientPromise;
  const db = client.db("frozenfusion");

  const now = new Date();

  const result = await db.collection<ProductDoc>("products").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  return result.insertedId.toString();
}

/**
 * Update product
 */
export async function updateProduct(
  id: string,
  data: Partial<Omit<ProductDoc, "_id" | "createdAt" | "updatedAt">>
) {
  const client = await clientPromise;
  const db = client.db("frozenfusion");

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  await db.collection<ProductDoc>("products").updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    }
  );
}

/**
 * Delete product
 */
export async function deleteProduct(id: string) {
  const client = await clientPromise;
  const db = client.db("frozenfusion");

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  await db.collection<ProductDoc>("products").deleteOne({
    _id: new ObjectId(id),
  });
}

/**
 * Toggle product visibility
 */
export async function toggleProductVisibility(
  id: string,
  visible: boolean
) {
  return updateProduct(id, {
    visible,
  });
}