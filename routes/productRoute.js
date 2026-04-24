import express from "express";
import { 
    createProductController,
    // getProductController,
    getAllProductsController,
} from '../controller/productCtrl.js';

const router = express.Router();

router.get('/get-all-products', getAllProductsController);
// router.get('/get-product/:id', getProductController);
router.post("/create-product", createProductController);

export default router;
