// All routes related to authentication and authorization should be here.
import {
    Router
} from 'express';

import passport from 'passport';

import {
    signUp,
    signIn
} from '../../controllers/authController';
import parser from '../../config/cloudinaryConfig';
import passportConfig from '../../config/passport';


const router = Router();

passportConfig(passport);

router.post('/signup', parser.single('logo'), signUp);

router.post('/signin', passport.authenticate('jwt', {
    session: false
}), signIn);


export default router;