import express from "express";
import morgan from "morgan";
import cors from "cors";

import auth from "./routes/api/authAdmin";
import customer from "./routes/api/customer";
import center from "./routes/api/center";
import booking from "./routes/api/booking";
import { connect, dropTables } from "./config/dbconnection";

// App initalization
const app = express();

// Enabling CORS
app.use(cors());

// Connecting to database
connect();

//dropTables();

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
  res.status(200).json({
    success: true,
    message: "Hello there! Welcome to Magnitude Event Manager.",
    api_doc:
      "https://documenter.getpostman.com/view/6511530/T17NbQMH?version=latest",
  });
});

app.get("/api-docs", (res) => {
  res.redirect(
    301,
    "https://documenter.getpostman.com/view/6511530/T17NbQMH?version=latest"
  );
});

const port = process.env.PORT || 900;

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

export default app;
