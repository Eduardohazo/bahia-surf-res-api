import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readUsers } from "../utils/json.js";

dotenv.config();

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token with secret key
      // 1. Takes HEADER and PAYLOAD from the token
      // 2. Re-generates a new signature using your SECRET_KEY
      // 3. Compares the new signature vs the token's signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Load users from JSON
      const users = readUsers();
      const user = users.find((u) => u.id === decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request
      req.user = user;

      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  return res.status(401).json({ message: "No token provided" });
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  // TODO: check if its admin
  console.log("Inside isAdmin!");
  next();
});
