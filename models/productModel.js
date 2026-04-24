import { ProductSchema } from "../schemas/product.schema.js";
import connectDB from "../services/db.service.js";
import { AppError } from "../errors/AppError.js";
import { RequestStatus } from "../enums/RequestStatus.js";

// We define the Model as an object
export const ProductModel = {
  
  // Method 1: Create
  create: async (rawData) => {
    // 1. Validation 
    const validated = ProductSchema.safeParse(rawData);
    if (!validated.success) {
      throw new AppError(400, RequestStatus.responsePhase.VALIDATION_ERROR, "Invalid product data");
    }

    const db = await connectDB();
    
    await db.collection("products").insertOne(validated.data);
    
    return validated.data; // Return the clean object
  },

  // Method 2: Fetch All
  fetchAll: async () => {
    const db = await connectDB();

    // ANALISIS: ¿La colección existe?
    // (Opcional, pero para debug es joya)
    const collections = await db.listCollections({ name: "products" }).toArray();
    if (collections.length === 0) {
      // Si llegas aquí, sabes que el nombre "rders" está mal
      throw new AppError(500, RequestStatus.responsePhase.INTERNAL_SERVER_ERROR, "Unexistent db collection");
    }
    const rawProducts = await db.collection("products").find({}).toArray(); 

    return rawProducts;
  },
};