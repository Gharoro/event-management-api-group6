// All routes related to centers should be here.
import { Router } from 'express';
import passport from 'passport';

import { addCenter } from '../../controllers/centers';

const router = Router();

router.post('/add_center', passport.authenticate(), addCenter);

export default router;