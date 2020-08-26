import express from "express";
import morgan from "morgan";
import cors from "cors";

import auth from "./routes/api/authAdmin";
import customer from "./routes/api/customer";
import center from "./routes/api/center";
import booking from "./routes/api/booking";
import connect from "./config/dbconnection";

// App initalization
const app = express();

// Enabling CORS
app.use(cors({ credentials: true }));

// Connecting to database
connect();

// middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan("tiny"));

// Routes
app.use("/api/auth/admin", auth);
app.use("/api/center", center);
app.use("/api/auth/customer", customer);
app.use("/api/booking", booking);

app.get("/", (req, res) => {
  // res.send("Welcome to Magnitude Event Manager - SGA Group 6");
  res.status(200).json({
    success: true,
    message: "Magnitude Event Manager API - GROUP 6.",
    api_doc: "https://documenter.getpostman.com/view/6511530/T17NbQMH",
  });
});

app.get("/api-docs", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/6511530/T17NbQMH");
});

const port = process.env.PORT || 900;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
