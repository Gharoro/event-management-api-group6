import { Router } from "express";
const router = Router();

import { makeBooking, cancelBooking } from "../../controllers/authBookingController";
import {customerProtect} from "../../middleware/auth";

router.post("/:centerId/booking", customerProtect, makeBooking);
router.patch("/:centerId/:bookingId/cancelBooking", customerProtect, cancelBooking);

export default router;
