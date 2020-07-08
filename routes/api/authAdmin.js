import {
    Router
} from 'express';

import {
    signUp,
    signIn,
    adminProfile,
    editProfile
} from '../../controllers/authAdminController';
import {
    adminProtect
} from '../../middleware/auth';
import parser from '../../config/cloudinaryConfig';

const router = Router();

router.post('/admin/signup', parser.single('logo'), signUp);
router.post('/admin/signin', signIn);
router.get('/admin/profile', adminProtect, adminProfile);
router.put('/admin/profile/edit', adminProtect, parser.single('logo'), editProfile);


export default router;