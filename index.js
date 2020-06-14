import express from 'express';
import morgan from 'morgan';
import connect from './config/dbconnection';
import custormer from './routes/api/authCustomer';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan('tiny'));
// Connecting to database
connect();

app.use('/customer', custormer);
app.get('/', (req, res) => {
  res.send('Event Management Application API - SGA Group 6');
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});