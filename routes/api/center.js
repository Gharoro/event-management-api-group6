// All routes related to centers should be here.
import { Router } from 'express';
import passport from 'passport';

import { addCenter } from '../../controllers/centers';
import parser from '../../config/cloudinaryConfig';

const router = Router();

router.post('/add_center', passport.authenticate('jwt', { session: false }), parser.single('image'), addCenter);

export default router;