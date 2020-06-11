// All routes related to authentication and authorization should be here.
import { Router } from 'express';

import { signUp } from '../../controllers/authController';
import parser from '../../config/cloudinaryConfig';

const router = Router();

router.post('/signup', parser.single('logo'), signUp);


export default router;
