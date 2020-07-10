import {
    Router
} from "express";
const router = Router();

import {
    makeBooking,
    cancelBooking
} from "../../controllers/bookingController";
import {
    customerProtect
} from "../../middleware/auth";

router.post("/:centerId/book", customerProtect, makeBooking);
router.patch("/:centerId/:bookingId/cancelBooking", customerProtect, cancelBooking);

export default router;