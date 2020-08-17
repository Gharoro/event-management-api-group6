import { Router } from "express";
const router = Router();

import {
  makeBooking,
  cancelBooking,
  initializePayment,
  verifyPayment,
  customerViewBookings,
  pendingBookings,
  paidBookings,
  pastBookings,
  singleBooking,
} from "../../controllers/bookingController";
import { customerProtect } from "../../middleware/auth";

router.post("/:centerId/book", customerProtect, makeBooking);
router.post("/:bookingId/pay", customerProtect, initializePayment);
router.get("/:bookingId/verify_payment", customerProtect, verifyPayment);
router.get("/customer/viewall", customerProtect, customerViewBookings);
router.get("/customer/pending", customerProtect, pendingBookings);
router.get("/customer/paid", customerProtect, paidBookings);
router.get("/customer/past", customerProtect, pastBookings);
router.get("/:bookingId", customerProtect, singleBooking);
router.patch(
  "/:centerId/:bookingId/cancel_booking",
  customerProtect,
  cancelBooking
);

export default router;
