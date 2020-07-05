import { Router } from "express";

import {
  signup,
  signin,
  customerProfile
} from "../../controllers/customerController";
import { viewAllCenters, viewOneCenter } from "../../controllers/centersController";
import { customerProtect } from "../../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/view_all_centers", viewAllCenters);
router.get("/view_one_center/:id", viewOneCenter);
router.get("/profile", customerProtect, customerProfile);

export default router;
