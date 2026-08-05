import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface EventBooking {
  _id?: ObjectId | string;
  name: string;
  contactNo: string;
  deliveryAddress: string;
  eventDescription: string;
  eventType: string;
  status: "Pending" | "Reviewed" | "Contacted";
  appliedAt: Date;
}

export async function getEventBookings() {
  const client = await clientPromise;
  const db = client.db("frozenfusion");
  const events = await db
    .collection<EventBooking>("events")
    .find({})
    .sort({ appliedAt: -1 })
    .toArray();
  
  return events.map((e) => ({ ...e, _id: e._id?.toString() }));
}

export async function deleteEventBooking(id: string) {
  const client = await clientPromise;
  const db = client.db("frozenfusion");
  await db.collection<EventBooking>("events").deleteOne({ _id: new ObjectId(id) });
}

export async function updateEventStatus(id: string, status: EventBooking["status"]) {
  const client = await clientPromise;
  const db = client.db("frozenfusion");
  await db.collection<EventBooking>("events").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
}
