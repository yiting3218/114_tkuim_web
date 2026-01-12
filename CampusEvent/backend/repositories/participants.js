import { ObjectId } from "mongodb";
import { getDB } from "../db/index.js";

const collection = () => getDB().collection("participants");

export async function createParticipant(data) {
  const now = new Date();
  const result = await collection().insertOne({
    name: data.name,
    email: data.email,
    eventTitle: data.eventTitle,
    status: data.status || "pending",
    note: data.note || "",
    createdAt: now,
    updatedAt: now
  });
  return result.insertedId;
}

export async function findParticipants() {
  return collection().find().sort({ createdAt: -1 }).toArray();
}

export async function findParticipantById(id) {
  return collection().findOne({ _id: new ObjectId(id) });
}

export async function updateParticipant(id, patch) {
  const result = await collection().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...patch,
        updatedAt: new Date()
      }
    }
  );
  return result.matchedCount > 0;
}

export async function deleteParticipant(id) {
  const result = await collection().deleteOne({
    _id: new ObjectId(id)
  });
  return result.deletedCount > 0;
}
