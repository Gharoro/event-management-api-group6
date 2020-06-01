import express from "express";
import morgan from "morgan";
import connect from "./config/dbconnection";
import signUp from "./routes/api/auth";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(morgan("tiny"));

app.use('/api/auth', signUp);
// Handle error here with the middleware below
app.use((error, req, res, next) => {
  let err = error.message;
  let key = 'error';
  if (Array.isArray(error)) {
    key = 'errors';
  }

  return res.status(err.status || 500).json({ [key]: err });
});

// Connecting to database
connect();

app.use((req, res, next) => {
  let err = new Error("NOT FOUND");
  err.status = 404;
  return next(err);
});


if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

app.get("/", (req, res) => {
  res.send("Event Management Application API - SGA Group 6");
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
