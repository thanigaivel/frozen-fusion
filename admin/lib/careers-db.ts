import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface CareerApplication {
  _id: string;
  name: string;
  email: string;
  role: string;
  fileName?: string;
  fileType?: string;
  fileBase64?: string;
  appliedAt: Date;
}

export async function getCareerApplications(): Promise<CareerApplication[]> {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const careers = await db
      .collection("careers")
      .find({})
      .sort({ appliedAt: -1 })
      .toArray();

    return careers.map((career) => ({
      ...career,
      _id: career._id.toString(),
    })) as CareerApplication[];
  } catch (error) {
    console.error("[GET CAREERS ERROR]", error);
    return [];
  }
}

export async function getCareerApplicationById(id: string): Promise<CareerApplication | null> {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const career = await db.collection("careers").findOne({ _id: new ObjectId(id) });

    if (!career) return null;

    return {
      ...career,
      _id: career._id.toString(),
    } as CareerApplication;
  } catch (error) {
    console.error("[GET CAREER BY ID ERROR]", error);
    return null;
  }
}
