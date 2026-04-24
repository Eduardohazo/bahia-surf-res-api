import { RequestStatus } from "../enums/RequestStatus.js";
import { AppError } from "../errors/AppError.js";
import { ProductModel } from "../models/productModel.js";
import { ProductSchema } from "../schemas/product.schema.js";
import { z } from "zod"

export const getAllProducts = async () => {
  const rawProducts = await ProductModel.fetchAll();

  // Scenario: Database is empty (Not necessarily an error, but good to know)
  if (!rawProducts || rawProducts.length === 0) {
    return [];
  }

  // 2. Validation (Integrity Check)
  const parsed = ProductSchema.array().safeParse(rawProducts);
  if (!parsed.success) {
    // Log the actual Zod error for debugging, but throw a clear message
    console.error("Zod Validation Error - Products:", z.treeifyError(parsed.error));

    throw new AppError(
      500,
      RequestStatus.responsePhase.DATA_CORRUPTION,
      "Data inconsistency in Database",
    );
  }

  return parsed.data;
};


