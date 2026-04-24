import express from "express";
import { 
    createOrderController,
    getOrderController,
    getAllOrdersController,
    // deleteOrderController
} from '../controller/orderCtrl.js';

const router = express.Router();

router.post("/create-order", createOrderController);
router.get('/get-order/:id', getOrderController);
router.get('/get-all-orders', getAllOrdersController);

export default router;



