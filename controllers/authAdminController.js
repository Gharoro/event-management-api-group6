import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  config
} from 'dotenv';
import models from '../models';

config();

const signUp = async (req, res, next) => {
  // destructuring data coming from the user
  const {
    firstName,
    lastName,
    address,
    email,
    password,
    confirmPassword,
    businessName,
    phoneNum,
  } = req.body;

  const logo = req.file;
  const allowedTypes = ['image/png', 'image/jpeg'];
  if (logo === undefined) {
    return res.status(400).json({
      status: 400,
      message: 'Please upload a logo for your event center',
    });
  }
  if (logo.size > 2000000) {
    return res.status(400).json({
      status: 400,
      message: 'Logo must be less than 2mb',
    });
  }
  if (allowedTypes.indexOf(logo.mimetype) === -1) {
    return res.status(400).json({
      status: 400,
      message: 'Please upload a jpg, jpeg or png file',
    });
  }
  if (!firstName || !lastName || !address || !password || !confirmPassword || !businessName || !phoneNum || !email) {
    return res.status(400).json({
      status: 400,
      message: 'All fields must be filled',
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: 'Password do not match',
    });
  }
  const phoneNumStr = phoneNum.split('');
  if (phoneNumStr.length !== 11 || phoneNum.match(/[^0-9]/g)) {
    return res.status(400).json({
      status: 400,
      message: 'Phone number must be a number not less than 11 characters',
    });
  }
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    return res.status(400).json({
      status: 400,
      message: 'Email do not match correct format',
    });
  }
  try {
    const checkMangers = await models.Manager.findAll({
      where: {
        email
      },
    });
    if ((checkMangers.length > 0)) {
      return res.status(400).json({
        status: 400,
        message: 'User already exist please log in or check credentials passed',
      });
    }
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
      logo: logo.path,
    });
    if (managers) {
      // return a success message on completion
      return res.json({
        status: 200,
        message: 'Account created successfully',
      });
    }
    // return an error message on failure
    return res.status(500).json({
      status: 500,
      message: 'Unable to create user at the moment',
    });
  } catch (error) {
    return next(error);
  }
};

const signIn = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  // check if user inputs email or password
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'Please enter valid credentials',
    });
  }
  try {
    const managerExist = await models.Manager.findAll({
      where: {
        email
      }
    }); // check if user exist
    if (managerExist.length < 1) {
      return res.status(404).json({
        status: 404,
        message: 'User does not exist! Please check your signin details',
      });
    }
    // extracting relevant information from user database
    const manager_password = managerExist[0].dataValues.password;
    const manager_id = managerExist[0].dataValues.id;

    const passwordMatch = await bcrypt.compare(password, manager_password); // returns true or false
    if (passwordMatch) {
      // defining the contents of the payload
      const payload = {
        id: manager_id
      };
      // signing the token
      jwt.sign(payload, process.env.secretOrkey, {
        expiresIn: 10800000
      }, (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          status: 200,
          message: 'Login successful',
          token: `Bearer ${token}`,
        });
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: 'Incorrect Credentials',
      });
    }
  } catch (error) {
    return next(error);
  }
};

const adminProfile = async (req, res, next) => {
  res.json({
    admin: req.user
  });
  // return res.json({
  //   success: true,
  //   message: 'Welcome Admin',
  //   profile: {
  //     id: req.user.id,
  //     firstname: req.user.firstName,
  //     lastname: req.user.lastName,
  //     email: req.user.email,
  //     phone_number: req.user.phoneNum,
  //     role: req.user.role,
  //     business_name: req.user.businessName,
  //     address: req.user.address,
  //     logo: req.user.logo,
  //     register_date: req.user.createdAt,
  //   }
  // });
}

export {
  signUp,
  signIn,
  adminProfile
};