import { Router } from "express";

import {
  signup,
  signin,
  customerProfile,
  customerBookings,
} from "../../controllers/customerController";
import { customerProtect } from "../../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile", customerProtect, customerProfile);
router.get("/bookings", customerProtect, customerBookings);

export default router;
