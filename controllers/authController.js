// All methods related to authentication and authorization should be here.
import models from "../models";
import bcrypt from "bcryptjs";
import { validate } from "jsonschema";
import signUpSchema from "./signUpSchema";

//Creating validation before inserting records into the db
const signUp = async (req, res, next) => {
  // destructuring data coming from the user
  const {
    firstName,
    lastName,
    address,
    logo,
    email,
    password,
    businessName,
    phoneNum
  } = req.body;

  try {
    // creating an object to be passed into jsonschema for validation
    const managerData = {data: req.body};

    const validateManager = await validate(managerData, signUpSchema);
    // If user is not valid throw an error through the error stack otherwise continue with inserting data
    if (!validateManager.valid){
      return next(validateManager.errors.map(err => err.stack))
    }
// hash password before saving into db
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create submit records to the db once validated and password hased
    const managers = await models.Manager.create({
      firstName,
      lastName,
      address,
      email,
      password: hashedPassword,
      businessName,
      phoneNum,
      logo
    });
    // return a success message on completion
    return res.json({
      status: 200,
      message: "User has been created successfully"
    });
  } catch (error) {
    return next(error);
  }
};
export { signUp };
