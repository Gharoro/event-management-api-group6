import models from "../models";
import { check } from "express-validator";
const makeBooking = async (req, res, next) => {
  const { event_date, from, to, purpose, additional_info } = req.body;

  if (!event_date || !from || !to || !purpose) {
    return res.status(401).json({
      status: 400,
      message: "all required fileds must be filled before booking an event"
    });
  }
  const customerId = req.user.id;
  const centerId = req.params.centerId;

  try {
    const findCenter = await models.Centers.findOne({
      where: { id: centerId }
    });

    if (!findCenter) {
      return res
        .status(404)
        .json({
          status: 404,
          message: "cannot book an event hall that does not exist"
        });
    }

    const centerNotAvailable = await models.Centers.update(
      {
        available: false
      },
      { where: { id: centerId } }
    );

    const booking = await models.booking.create({
      event_date,
      from,
      to,
      purpose,
      customerId,
      additional_info,
      centerId
    });

    // set center availability to false

    if (booking && centerNotAvailable) {
      return res.status(200).json({
        status: 200,
        success: "you have successfully book this Hall"
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Unable to make booking at the moment"
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  const customerId = req.user.id;
  const bookingId = req.params.bookingId;
  const centerId = req.params.centerId;

  //confirm if it is the same customer that made the booking
  try {
    const checkCustomer = await models.booking.findOne(
      { attributes: ["customerId"] },
      {
        where: {
          customerId
        }
      }
    );

    if (!checkCustomer) {
      return res.status(401).json({
        status: 401,
        message: "Sorry you cannot cancel this booking"
      });
    }
    // Set center available to true in center and
    const centerAvalilable = await models.Centers.update(
      { available: true },
      { where: { id: centerId } }
    );

    // set booking status to cancel
    const deleteBooking = await models.booking.update(
      {
        status: "cancel"
      },
      {
        where: {
          id: bookingId
        }
      }
    );
    if (deleteBooking && centerAvalilable) {
      return res.status(200).json({
        status: 200,
        message: "This booking has been canceled"
      });
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.status(200).json({
    status: 500,
    message: "You cannot cancel this booking at this time"
  });
};

export { makeBooking, cancelBooking };
