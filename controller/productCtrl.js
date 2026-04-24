import asyncHandler from "express-async-handler";
import { getAllProducts } from "../services/getAllProductsService.js";
import { createProductService } from "../services/createProductService.js";
import { sanitize } from "../utils/sanitizer.js";
import { sendResponse } from "../utils/responseHandler.js";
import { RequestStatus } from "../enums/RequestStatus.js";

// CREATE
export const createProductController = async (req, res) => {
  // TODO: is all done but not admin
  // 1. Sanitization
  const data = sanitize(req.body);

  // Behaviour business rule:
  if (data.price < 0) {
    return res.status(400).json({ error: "Price cannot be negative." });
  }

  // 2. Service / Use Cases
  const product = await createProductService(data);

  res.json({ message: "Product created", product });
};

// READ
export const getProductController = async (req, res) => {
  try {
    const id = req.params.id;

    // Get all products
    const products = await getAllProducts();

    // Find the product
    const product = products.find((p) => {
      return p.id_class === id;
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ
export const getAllProductsController = asyncHandler(async (req, res) => {
  const products = await getAllProducts();

  // SCENARIO: SUCCESS BUT EMPTY
  if (products.length === 0) {
    return sendResponse(
      res,
      200,
      RequestStatus.responsePhase.EMPTY,
      "No products found in the catalog",
      []
    );
  }

  // SCENARIO: SUCCESS WITH DATA
  return sendResponse(
    res,
    200,
    RequestStatus.responsePhase.SUCCESS,
    "Products retrieved successfully",
    products
  );
});
