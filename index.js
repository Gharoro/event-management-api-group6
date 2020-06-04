import express from 'express';
import morgan from 'morgan';
import connect from './config/dbconnection';
import auth from './routes/api/auth';

const app = express();

// Connecting to database
connect();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan
app.use(morgan('tiny'));

app.use('/api/auth', auth);

app.get('/', (req, res) => {
  res.send('Event Management Application API - SGA Group 6');
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
