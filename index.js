import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import connect from './config/dbconnection';
import auth from './routes/api/auth';
import center from './routes/api/center';
import passportConfig from './config/passport';
import customerProfile from './routes/api/customerProfile'

const app = express();

// Connecting to database
connect();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan
app.use(morgan('tiny'));

// Passport middleware
app.use(passport.initialize());
passportConfig(passport);

app.use('/api/auth', auth);
app.use('/api/center', center);


app.get('/', (req, res) => {
  res.send('Event Management Application API - SGA Group 6');
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
