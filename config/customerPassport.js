import {
    Strategy,
    ExtractJwt
} from 'passport-jwt';
import {
    config
} from 'dotenv';

import models from '../models/index';

config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey;

const customerPassportConfig = (passport) => {
    passport.use(new Strategy(opts, (jwtPayload, done) => {
        models.customers.findByPk(jwtPayload.id)
            .then((customer) => {
                if (customer) {
                    return done(null, customer);
                }
                return done(null, false);
            }).catch((error) => console.log(error));
    }));
};

export default customerPassportConfig;