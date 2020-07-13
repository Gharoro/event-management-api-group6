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
  pastBookings
} from "../../controllers/bookingController";
import { customerProtect } from "../../middleware/auth";

router.post("/:centerId/book", customerProtect, makeBooking);
router.post("/:bookingId/pay", customerProtect, initializePayment);
router.get("/:bookingId/verify_payment", customerProtect, verifyPayment);
router.get("/customer/viewall", customerProtect, customerViewBookings);
router.get("/customer/pending", customerProtect, pendingBookings);
router.get("/customer/paid", customerProtect, paidBookings);
router.get("/customer/past", customerProtect, pastBookings);
router.patch(
  "/:centerId/:bookingId/cancelBooking",
  customerProtect,
  cancelBooking
);

export default router;
