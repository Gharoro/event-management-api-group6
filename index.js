import express from 'express';
import morgan from 'morgan';
import passport from 'passport';

import auth from './routes/api/authAdmin';
import customer from './routes/api/customer';
import center from './routes/api/center';
import connect from './config/dbconnection';

import customerPassportConfig from './config/customerPassport';
import passportConfig from './config/adminPassport';

// App initalization
const app = express();

// Connecting to database
connect();

// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.use(morgan('tiny'));

// Passport
// app.use(passport.initialize());

// Routes
// passportConfig(passport);
app.use('/api/auth', auth);

app.use('/api/center', center);

// customerPassportConfig(passport);
app.use('/api/auth/customer', customer)


app.get('/', (req, res) => {
  res.send('Event Management Application API - SGA Group 6');
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});