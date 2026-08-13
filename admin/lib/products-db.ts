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

export async function getProducts(
  categoryId?: string
) {
  const client = await clientPromise;

  const db =
    client.db("frozenfusion");

  const query = categoryId
    ? {
      categoryId,
      visible: true,
    }
    : {
      visible: true,
    };

  const docs = await db
    .collection<ProductDoc>("products")
    .find(query, {
      projection: {
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
      },
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return docs.map((doc) => ({
    ...doc,
    _id: doc._id?.toString(),
  }));
}

export async function createProduct(
  data: Omit<
    ProductDoc,
    "_id" | "createdAt" | "updatedAt"
  >
) {
  const client =
    await clientPromise;

  const db =
    client.db("frozenfusion");

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

export async function updateProduct(
  id: string,
  data: Partial<ProductDoc>
) {
  const client = await clientPromise;

  const db = client.db("frozenfusion");

  console.log("====================================");
  console.log("[PRODUCTS DB UPDATE] START");
  console.log("[PRODUCTS DB UPDATE] Product ID:", id);
  console.log(
    "[PRODUCTS DB UPDATE] Image:",
    data.image || "NO IMAGE"
  );

  const objectId = new ObjectId(id);

  console.log(
    "[PRODUCTS DB UPDATE] ObjectId:",
    objectId.toString()
  );

  const result = await db
    .collection<ProductDoc>("products")
    .updateOne(
      {
        _id: objectId as unknown as string,
      },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );

  console.log(
    "[PRODUCTS DB UPDATE] matchedCount:",
    result.matchedCount
  );

  console.log(
    "[PRODUCTS DB UPDATE] modifiedCount:",
    result.modifiedCount
  );

  console.log(
    "[PRODUCTS DB UPDATE] acknowledged:",
    result.acknowledged
  );

  console.log("[PRODUCTS DB UPDATE] END");
  console.log("====================================");

  if (result.matchedCount === 0) {
    throw new Error(
      `Product ${id} was NOT found in MongoDB`
    );
  }

  return result;
}

export async function deleteProduct(
  id: string
) {
  const client =
    await clientPromise;

  const db =
    client.db("frozenfusion");

  await db
    .collection<ProductDoc>("products")
    .deleteOne({
      _id: new ObjectId(id) as unknown as string,
    });
}

export async function toggleProductVisibility(
  id: string,
  visible: boolean
) {
  return updateProduct(id, {
    visible,
  });
}