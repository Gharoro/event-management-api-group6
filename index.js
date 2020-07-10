import express from "express";
import morgan from "morgan";

import auth from "./routes/api/authAdmin";
import customer from "./routes/api/customer";
import center from "./routes/api/center";
import booking from "./routes/api/booking";
import connect from "./config/dbconnection";

// App initalization
const app = express();

// Connecting to database
connect();

// middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(morgan("tiny"));

// Routes
app.use("/api/auth/admin", auth);
app.use("/api/center", center);
app.use("/api/auth/customer", customer);
app.use("/api/booking", booking);

app.get("/", (req, res) => {
  res.send("Event Management Application API - SGA Group 6");
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});