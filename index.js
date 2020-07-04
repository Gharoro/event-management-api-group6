import express from 'express';
import morgan from 'morgan';
import auth from './routes/api/auth';
import center from './routes/api/center';
import connect from './config/dbconnection';
import customer from './routes/api/authCustomer';
import passport from 'passport';


// App initalization
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.use(morgan('tiny'));


// Passport
app.use(passport.initialize());



// Connecting to database
connect();



// Routes
app.use('/api/auth', auth);
app.use('/api/center', center);
app.use('/api/auth/customer', customer)


app.get('/', (req, res) => {
  res.send('Event Management Application API - SGA Group 6');
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});