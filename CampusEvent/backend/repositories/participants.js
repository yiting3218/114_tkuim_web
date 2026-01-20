// backend/repositories/participants.js
import { ObjectId } from "mongodb";
import { getDB } from "../db/index.js";

const collection = () => getDB().collection("participants");

export async function createParticipant(data) {
  const now = new Date();

  const doc = {
    name: data.name,
    studentId: data.studentId,
    department: data.department,
    eventTitle: data.eventTitle,
    status: data.status || "pending",
    note: data.note || "",
    createdAt: now,
    updatedAt: now
  };

  const result = await collection().insertOne(doc);
  return result.insertedId;
}

export async function findParticipants() {
  return collection().find().sort({ createdAt: -1 }).toArray();
}

export async function findParticipantById(id) {
  return collection().findOne({ _id: new ObjectId(id) });
}

export async function updateParticipant(id, patch) {
  const now = new Date();

  const result = await collection().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...patch,
        updatedAt: now
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
