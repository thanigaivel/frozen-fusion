import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const messages = await db
      .collection("contacts")
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    return messages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
    })) as ContactMessage[];
  } catch (error) {
    console.error("[GET CONTACTS ERROR]", error);
    return [];
  }
}
