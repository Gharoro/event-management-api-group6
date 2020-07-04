import {
    Router
} from 'express';

import passport from 'passport';

import {
    signUp,
    signIn,
    adminProfile
} from '../../controllers/authAdminController';
import parser from '../../config/cloudinaryConfig';

const router = Router();

router.post('/signup', parser.single('logo'), signUp);
router.post('/signin', signIn);
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), adminProfile);


export default router;