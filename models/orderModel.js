import { RequestStatus } from "../enums/RequestStatus.js";
import { AppError } from "../errors/AppError.js";
import connectDB from "../services/db.service.js";
import { ObjectId } from "mongodb";

export const OrderModel = {
  // 1. Create - Raw DB Insert
  create: async (validatedOrder) => {
    const db = await connectDB();
    return await db.collection("orders").insertOne(validatedOrder);
  },

  // 2. Fetch One - Your logic for MongoID or String ID
  fetchById: async (orderId) => {
    const db = await connectDB();

    // ANALISIS: ¿La colección existe?
    // (Opcional, pero para debug es joya)
    const collections = await db.listCollections({ name: "orders" }).toArray();
    if (collections.length === 0) {
      // Si llegas aquí, sabes que el nombre "rders" está mal
      throw new AppError(
        500,
        RequestStatus.responsePhase.INTERNAL_SERVER_ERROR,
        "Unexistent db collection",
      );
    }
    console.log("ORDER ID::> ",orderId);
    return await db
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });
  },

  // 3. Fetch All - Bringing back the "Missing" logic
  fetchAll: async () => {
    const db = await connectDB();

    const collections = await db.listCollections({ name: "orders" }).toArray();
    if (collections.length === 0) {
      // Si llegas aquí, sabes que el nombre "rders" está mal
      throw new AppError(
        500,
        RequestStatus.responsePhase.INTERNAL_SERVER_ERROR,
        "Unexistent db collection",
      );
    }

    return await db.collection("orders").find({}).toArray();
  },

  // 4. Delete Expired - Your original cleanup logic
  deleteById: async (id) => {
    console.log("id before delete one",id);
    const db = await connectDB();
    const result = await db.collection("orders").deleteOne({
      _id: id,
    });
    console.log("Deleted count:", result.deletedCount);
    return result;
  },
};
