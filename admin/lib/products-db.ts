import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface ProductDoc {
  _id?: string;
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
 * Get all products.
 *
 * If categoryId is provided, only products from
 * that category are returned.
 */
export async function getProducts(
  categoryId?: string
) {
  const client = await clientPromise;

  const db = client.db("frozenfusion");

  const query = categoryId
    ? { categoryId }
    : {};

  const docs = await db
    .collection<ProductDoc>("products")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((d) => ({
    ...d,
    _id: d._id?.toString(),
  }));
}

/**
 * Get a single product by MongoDB ID.
 *
 * This is used when updating a product so that
 * we can remember the OLD Cloudinary image URL
 * before replacing it with a new image.
 */
export async function getProductById(
  id: string
) {
  const client = await clientPromise;

  const db = client.db("frozenfusion");

  // Validate MongoDB ObjectId before querying
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const product =
    await db
      .collection<ProductDoc>("products")
      .findOne({
        _id: new ObjectId(id) as unknown as string,
      });

  if (!product) {
    return null;
  }

  return {
    ...product,
    _id: product._id?.toString(),
  };
}

/**
 * Create a new product.
 */
export async function createProduct(
  data: Omit<
    ProductDoc,
    "_id" | "createdAt" | "updatedAt"
  >
) {
  const client = await clientPromise;

  const db = client.db("frozenfusion");

  const now = new Date();

  const result =
    await db
      .collection<ProductDoc>("products")
      .insertOne({
        ...data,
        createdAt: now,
        updatedAt: now,
      });

  return result.insertedId.toString();
}

/**
 * Update an existing product.
 *
 * Important:
 * Only fields provided in `data` are updated.
 *
 * Therefore, if `image` is NOT included,
 * the existing image remains unchanged.
 */
export async function updateProduct(
  id: string,
  data: Partial<ProductDoc>
) {
  const client = await clientPromise;

  const db = client.db("frozenfusion");

  if (!ObjectId.isValid(id)) {
    throw new Error(
      `Invalid product ID: ${id}`
    );
  }

  await db
    .collection<ProductDoc>("products")
    .updateOne(
      {
        _id: new ObjectId(
          id
        ) as unknown as string,
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
 * Delete a product from MongoDB.
 *
 * Cloudinary image deletion is handled separately
 * in the API route.
 */
export async function deleteProduct(
  id: string
) {
  const client = await clientPromise;

  const db = client.db("frozenfusion");

  if (!ObjectId.isValid(id)) {
    throw new Error(
      `Invalid product ID: ${id}`
    );
  }

  await db
    .collection<ProductDoc>("products")
    .deleteOne({
      _id: new ObjectId(
        id
      ) as unknown as string,
    });
}

/**
 * Toggle product visibility.
 */
export async function toggleProductVisibility(
  id: string,
  visible: boolean
) {
  return updateProduct(id, {
    visible,
  });
}