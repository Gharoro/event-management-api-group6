import {
  Router
} from "express";

import {
  addCenter,
  viewOneCenter,
  viewAllCenters,
  deleteCenter,
  updateCenter,
  setUnavailableDates,
  removeDates
} from "../../controllers/centersController";
import {
  adminProtect
} from "../../middleware/auth";
import parser from "../../config/cloudinaryConfig";

const router = Router();

router.post("/add_center", adminProtect, parser.single("image"), addCenter);
router.get("/view_all_centers", viewAllCenters);
router.get("/view_one_center/:id", viewOneCenter);
router.delete("/delete_center/:id", adminProtect, deleteCenter);
router.patch("/set_date/:id", adminProtect, setUnavailableDates);
router.patch("/remove_date/:id", adminProtect, removeDates);
router.patch(
  "/update_center/:id",
  adminProtect,
  parser.single("image"),
  updateCenter
);
export default router;