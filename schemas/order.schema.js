import { z } from "zod";

export const OrderSchema = z.object({
  // 1. Datos del Cliente
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.number().min(10, "Teléfono incompleto"),

  // 2. Datos de la Clase (Formato Fecha Real)
  // z.coerce.date() toma "2026-04-10" y lo convierte en new Date()
  reservationDate: z.coerce.date(),
  schedule: z.enum(["07:00 - 09:00 am", "09:30 - 11:30 am", "04:30 - 06:30 pm"]),

  paymentMethod: z.object({
    method: z.string(),
  }),

  items: z.array(
    z.object({
      productId: z.string(),
      price: z.number().min(10),
    }),
  ),

  // 3. Metadatos de Control (Nivel 3: Integridad)
  _id: z.any().optional(),
  id_order: z.string().optional(),
  status: z
    .enum(["PENDING", "PAID", "EXPIRED", "CANCELLED"])
    .default("PENDING")
    .optional(),

  // Timestamps automáticos
  expiresAt: z.coerce.date().optional(),
  capturedAt: z.coerce.date().optional(),
  createdAt: z.date().default(() => new Date()), // Fecha de creación automática

  // Created at payment moment
  paypalOrderId: z.string().optional(),

});
