// Authentication for customer signup and signin
import models from "../models";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {
  config
} from 'dotenv';

config();

const signup = async (req, res, next) => {
  // destructruing data from the user
  const {
    firstname,
    lastname,
    password,
    confirm_password,
    email,
    phone_number,
    gender
  } = req.body;

  if (
    !firstname ||
    !lastname ||
    !password ||
    !confirm_password ||
    !email ||
    !phone_number ||
    !gender
  ) {
    
    return res.status(400).json({
      status: 400,
      message: "All fields are required"
    });
  }
  if (
    !firstname.trim().match(/^[A-Za-z]+$/) ||
    !lastname.trim().match(/^[A-Za-z]+$/)
  ) {
    return res.status(400).json({
      status: 400,
      message: "firstname and lastname must  be alphabets"
    });
  }
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    return res.status(400).json({
      status: 400,
      message: "Email do not match correct format"
    });
  }
  const phoneNumStr = phone_number.split("");
  if (phoneNumStr.length !== 11 || phone_number.match(/[^0-9]/g)) {
    return res.status(400).json({
      status: 400,
      message: "Phone number must be a number equal to 11 numbers"
    });
  }
  if (password !== confirm_password) {
    return res.status(400).json({
      status: 400,
      message: "password must match"
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkExist = await models.customers.findOne({
      where: {
        email
      }
    });
    //  throw an error if the user alreaddy exist
    if (checkExist) {
      return res.status(400).json({
        status: 400,
        message: "Email taken choose another email"
      });
    }
    // submit data if all information are valid

    const customer = await models.customers.create({
      firstname,
      lastname,
      password: hashedPassword,
      email,
      phone_number,
      gender,
      role: "user"
    });
    // If account creation is successful return a success message and the data
    if (customer) {
      return res.status(200).json({
        status: 200,
        message: "Your account has been successfully created"
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Unable to create an account at this time, try again"
    });
  } catch (error) {
    return next(error);
  }
};

const signin = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "All fields are required"
    });
  }

  try {
    const customer = await models.customers.findOne({
      where: {
        email
      }
    });

    if (!customer) {
      res.status(400).json({
        status: 400,
        message: "User does not Exist please check details supplied"
      });
    }

    // if user exists extract relevant values from the customer
    const id = customer.dataValues.id;
    const role = customer.dataValues.role;
    const customer_password = customer.dataValues.password;
    // check if the password the user supplied is the same as the one in the db
    const password_match = await bcrypt.compare(password, customer_password);

    if (password_match) {
      const payload = {
        id,
        role
      };

      // sign token with the details
      jwt.sign(payload, process.env.secretOrkey, {
        expiresIn: 10800000
      }, ((error, token) => {
        if (error) throw error;

        return res.status(200).json({
          status: 200,
          message: 'Login Successful',
          token: `Bearer ${token}`
        })
      }))
    } else
      return res.status(400).json({
        status: 400,
        message: 'Incorrect Password'
      })
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const customerProfile = async (req, res, next) => {
  res.json({
    success: true,
    message: 'Welcome',
    profile: {
      id: req.user.id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      phone_number: req.user.phone,
      role: req.user.role,
      gender: req.user.gender,
      register_date: req.user.createdAt,
    }
  });
}



export {
  signup,
  signin,
  customerProfile,
  
};