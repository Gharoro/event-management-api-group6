import { Router } from "express";
const router = Router();

import {
  makeBooking,
  cancelBooking,
  initializePayment,
  verifyPayment,
} from "../../controllers/bookingController";
import { customerProtect } from "../../middleware/auth";

router.post("/:centerId/book", customerProtect, makeBooking);
router.post("/:bookingId/pay", customerProtect, initializePayment);
router.get("/:bookingId/verify_payment", customerProtect, verifyPayment);
router.patch(
  "/:centerId/:bookingId/cancelBooking",
  customerProtect,
  cancelBooking
);

export default router;
