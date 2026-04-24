import { z } from "zod";

export const ProductSchema = z.object({
  id_class: z.string(), 
  title: z.string().default("Surf Class - 2 Hours"),
  description: z.string(),
  price: z.number().min(10).max(10), 
  _id: z.any().optional(),
});
