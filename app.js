import dotenv from "dotenv";
// .env config
dotenv.config();
import express from "express";
import cors from "cors";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import connectDB from "./services/db.service.js";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { handleError } from "./utils/errorHandler.js";


// Server
const app = express();

// Load your YAML file (ensure the path is correct)
const swaggerDocument = YAML.load(path.join(process.cwd(), './docs/openapi.yaml'));

// Port
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "https://bahiasurf.netlify.app",
  "https://bahiasurfschool.mx"
];

// Middelwares

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
})); // * for production

// app.use(cors()); // * for development

app.use(express.json());

// Routes
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/payments", paymentRouter);
// Endpoint to view the docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Global error handler
app.use(handleError);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Ember REST API listening on port ${PORT}`);
  });
}

startServer();










