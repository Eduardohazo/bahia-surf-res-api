import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

console.log(process.env.MONGO_URI);

const uri = process.env.MONGO_URI

const client = new MongoClient(uri)

let db

async function connectDB() {

  if (!db) {
    await client.connect()

    db = client.db(process.env.MONGO_DB_NAME)

    console.log("MongoDB connected")
  }

  return db
}

export default connectDB;
