import { Router } from "express";
const router = Router();

import { makeBooking } from "../../controllers/authBookingController";
import {customerProtect} from "../../middleware/auth";

router.post("/:centerId/booking", customerProtect, makeBooking);

export default router;
