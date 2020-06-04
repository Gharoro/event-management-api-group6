// All routes related to authentication and authorization should be here.
import { Router } from 'express';
import { signUp } from '../../controllers/authController';

const router = Router();

router.post('/signup', signUp);


export default router;
