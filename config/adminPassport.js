import { Strategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";

import models from "../models/index";

config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey;

const passportConfig = passport => {
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      models.Managers.findByPk(jwtPayload.id)
        .then(manager => {
          if (manager) {
            return done(null, manager);
          }
          return done(null, false);
        })
        .catch(error => console.log(error));
    })
  );
};

export default passportConfig;
