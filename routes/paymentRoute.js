import express from "express";
import { 
    createPaymentOrderController,
    capturePaymentController
} from '../controller/paymentCtrl.js';

const router = express.Router();

// Create payment order on paypal and send card data
router.post("/create-intent", createPaymentOrderController);
// Confirm to pay the order on paypal and register payment on mongo db
router.post("/capture-order", capturePaymentController);


export default router;




