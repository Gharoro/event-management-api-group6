import {
  Router
} from "express";

import {
  signUp,
  signIn,
  adminProfile
} from "../../controllers/authAdminController";
import {
  adminProtect
} from "../../middleware/auth";
import parser from "../../config/cloudinaryConfig";

const router = Router();

router.post("/signup", parser.single("logo"), signUp);

router.post("/signin", signIn);
router.get("/profile", adminProtect, adminProfile);

export default router;