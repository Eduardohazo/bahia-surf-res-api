import { ProductModel } from "../models/productModel.js";

export async function createProductService(data) {
  try {
    const result = await ProductModel.create(data);

    return result;
  } catch (error) {
    console.error(error);
  }
}
