// Database connection function goes here
import { Sequelize } from "sequelize";
import { config } from "dotenv";

import models from "../models/index";

config();

if (process.env.NODE_ENV === "test") {
  // switch database to test database
  process.env.DB_NAME = "event_mgt_test_db";
}
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to database...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

function dropTables() {
  models.sequelize
    .sync({
      force: true,
      logging: false,
    })
    .then((result) => {
      console.log("All models were synchronized successfully.");
    })
    .catch((error) => console.log("An error occured: ", error));
}
// async function dropTables() {
//   try {
//     await models.sequelize.sync({
//       force: true,
//     });
//     console.log("All models were synchronized successfully.");
//   } catch (error) {
//     console.error('Could not drop table', error);
//   }
// }

export { connect, dropTables };
