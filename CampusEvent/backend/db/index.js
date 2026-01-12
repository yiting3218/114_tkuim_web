import dotenv from "dotenv";
dotenv.config(); 

import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  console.log("DB CONNECT URI =", uri);

  if (!uri) {
    throw new Error("MONGODB_URI is undefined");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  console.log("MongoDB connected:", dbName);
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
