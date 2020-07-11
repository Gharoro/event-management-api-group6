import {
    Router
} from "express";

import {
    addCenter,
    viewOneCenter,
    viewAllCenters,
    searchCenter,
    newSearch
} from "../../controllers/centersController";
import {
    adminProtect
} from "../../middleware/auth";
import parser from "../../config/cloudinaryConfig";

const router = Router();


router.post("/add_center", adminProtect, parser.single("image"), addCenter);
router.get("/view_all_centers", viewAllCenters);
router.get("/view_one_center/:id", viewOneCenter);
router.get("/search/q", searchCenter);

export default router;