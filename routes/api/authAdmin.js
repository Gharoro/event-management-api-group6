import {
    Router
} from 'express';

import passport from 'passport';

import {
    signUp,
    signIn
} from '../../controllers/authAdminController';
import parser from '../../config/cloudinaryConfig';
import passportConfig from '../../config/adminPassport';


const router = Router();

passportConfig(passport);

router.post('/signup', parser.single('logo'), signUp);

router.post('/signin', signIn);


export default router;