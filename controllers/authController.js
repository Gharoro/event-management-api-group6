/* eslint-disable max-len */
// All methods related to authentication and authorization should be here.
import bcrypt from 'bcryptjs';
import models from '../models';

const signUp = async (req, res, next) => {
  // destructuring data coming from the user
  const {
    firstName,
    lastName,
    address,
    logo,
    email,
    password,
    confirmPassword,
    businessName,
    phoneNum,
  } = req.body;

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
      where: { email },
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
      logo,
    });
    if (managers) {
      // return a success message on completion
      return res.json({
        status: 200,
        message: 'User has been created successfully',
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
export { signUp };
