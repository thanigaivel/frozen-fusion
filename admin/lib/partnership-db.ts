import clientPromise from "./mongodb";

export interface PartnershipInquiry {
  _id: string;
  name: string;
  contact: string;
  address: string;
  description: string;
  selectedType: string;
  createdAt: Date;
}

export async function getPartnerships(): Promise<PartnershipInquiry[]> {
  try {
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const partnerships = await db
      .collection("partnerships")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return partnerships.map((item) => ({
      ...item,
      _id: item._id.toString(),
    })) as PartnershipInquiry[];
  } catch (error) {
    console.error("[GET PARTNERSHIPS ERROR]", error);
    return [];
  }
}
