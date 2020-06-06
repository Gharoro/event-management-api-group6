// All routes related to authentication and authorization should be here.
import { Router } from 'express';

import { signUp, signIn } from '../../controllers/authController';
import parser from '../../config/cloudinaryConfig';

const router = Router();

router.post('/signup', parser.single('logo'), signUp);

router.post('/signin', signIn);


export default router;
