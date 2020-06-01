// All routes related to authentication and authorization should be here.
import {signUp} from '../../controllers/authController';
import {Router} from 'express';

const router = Router();

router.post('/signUp', signUp);

export default router;
