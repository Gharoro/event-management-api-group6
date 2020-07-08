import {Router} from 'express';
const router = Router();

import {makeBooking} from '../../controllers/authBookings';

router.get('/', makeBooking)

export default router;