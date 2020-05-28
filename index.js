import express from 'express';

import connect from './config/dbconnection';

const app = express();

// Connecting to database
connect();

app.get('/', (req, res) => {
  res.send('Event Management Application API - SGA Group 6');
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});