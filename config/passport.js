import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from 'dotenv';

import models from '../models/index';

config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey;

const passportConfig = (passport) => {
  passport.use(new Strategy(opts, (jwtPayload, done) => {
    models.Manager.findByPk(jwtPayload.id)
      .then((manager) => {
        if (manager) {
          return done(null, manager);
        }
        return done(null, false);
      }).catch((error) => console.log(error));
  }));
};

export default passportConfig;
import {Strategy, ExtractJwt} from 'passport-jwt';
import { config } from 'dotenv';

import models from '../models'
config();

const opts = {}

//Add the key of jwtFromRequest to opts object and fill it with the value of authheader coming from extract jwt method

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// Also add a key of secretOrKey to the opts object and assign the value gotten from the environment file to it which is the key
opts.secretOrKey = process.env.SECRET_PASSPORT_KEY;

const customerPassportConfig = passport => {

  passport.use(new Strategy(opts, (jwtPayload, done)=>{
    models.customers.findByPk(jwtPayload.id)
      .then(customer =>{
        if(customer){
          return done(null, customer);
        }
        return done(null, false)
      }).catch(error => console.log(error))
  }))
}

export default customerPassportConfig;
