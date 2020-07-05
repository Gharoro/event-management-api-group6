import { Router } from "express";

import { addCenter} from "../../controllers/centersController";
import { adminProtect } from "../../middleware/auth";
import parser from "../../config/cloudinaryConfig";

const router = Router();


router.post("/add_center", adminProtect, parser.single("image"), addCenter);

export default router;
