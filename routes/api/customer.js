import {
    Router
} from "express";
import passport from 'passport';
import {
    signup,
    signin,
    customerProfile
} from "../../controllers/customerController";
import customerPassportConfig from '../../config/customerPassport';

customerPassportConfig(passport);

const router = Router();

router.post("/signup", signup);
router.post('/signin', signin);
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), customerProfile);

export default router;