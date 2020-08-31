import { config } from "dotenv";
import fetch from "node-fetch";
import crypto from "crypto";

import models from "../models";

config();

const makeBooking = async (req, res, next) => {
  const { event_date, from_time, to_time, purpose, additional_info } = req.body;

  // if (!event_date || !from_time || !to_time || !purpose) {
  //   return res.status(400).json({
  //     status: 400,
  //     error: "all required fileds must be filled before booking an event",
  //   });
  // }

  try {
    const customerId = req.user.id;
    let { centerId } = req.params;

    centerId = parseInt(centerId, 10);
    console.log(centerId);

    const findCenter = await models.Centers.findOne({
      where: {
        id: centerId,
      },
    });

    if (!findCenter) {
      return res.status(404).json({
        status: 404,
        error: "cannot book an event hall that does not exist",
      });
    }

    const dateArr = findCenter.dataValues.dates_unavailable;
    if (dateArr.indexOf(event_date) !== -1) {
      return res.status(400).json({
        status: 400,
        error: "Center already booked for this day",
      });
    }

    const newBooking = await models.booking.create({
      event_date,
      from_time,
      to_time,
      purpose,
      customerId,
      additional_info,
      centerId,
    });
    if (newBooking) {
      dateArr.push(event_date);
      await findCenter.update({
        dates_unavailable: dateArr,
      });

      return res.status(200).json({
        status: 200,
        success: "You have successfully book this Hall",
        bookingId: newBooking.id,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Unable to make booking at the moment",
    });
  } catch (error) {
    console.log("Error:", error);
    // return next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  const customerId = req.user.id;
  const bookingId = req.params.bookingId;
  const centerId = req.params.centerId;

  //confirm if it is the same customer that made the booking
  try {
    const booking = await models.booking.findOne({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return res.status(404).json({
        status: 404,
        error: "Invalid booking Id",
      });
    }

    if (booking.dataValues.customerId !== customerId) {
      return res.status(403).json({
        status: 403,
        error: "Sorry you cannot cancel this booking",
      });
    }

    const findCenter = await models.Centers.findOne({
      where: {
        id: centerId,
      },
    });
    const dateArr = findCenter.dataValues.dates_unavailable;
    // set booking status to cancel
    const deleteBooking = await models.booking.update(
      {
        status: "cancelled",
      },
      {
        where: {
          id: bookingId,
        },
      }
    );

    if (deleteBooking) {
      const index = dateArr.indexOf(checkCustomer.event_date);
      dateArr.splice(index, 1);
      await findCenter.update({
        dates_unavailable: dateArr,
      });

      return res.status(200).json({
        status: 200,
        message: "This booking has been canceled",
      });
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
  return res.status(200).json({
    status: 500,
    message: "You cannot cancel this booking at this time",
  });
};

const initializePayment = async (req, res, next) => {
  const { bookingId } = req.params;
  const customerEmail = req.user.email;

  const madeBooking = await models.booking.findByPk(bookingId);
  if (madeBooking.dataValues.status !== "Pending") {
    return res.status(400).json({
      status: 400,
      error: "Center already paid for or declined by admin",
    });
  }
  // Find center booking is being made for
  const center = await models.Centers.findByPk(madeBooking.dataValues.centerId);
  const centerAmount = center.dataValues.price * 100;
  // generate reference token
  const refToken = crypto.randomBytes(5).toString("hex");

  const raw = JSON.stringify({
    email: customerEmail,
    amount: centerAmount,
    reference: refToken,
  });

  let requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  };

  try {
    const payNow = await fetch(
      "https://api.paystack.co/transaction/initialize",
      requestOptions
    );
    const response = await payNow.json();
    // update booking referrence field
    await models.booking.update(
      {
        referrence: response.data.reference,
      },
      {
        where: {
          id: bookingId,
        },
      }
    );

    return res.json({
      response,
    });
  } catch (error) {
    return next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  const { bookingId } = req.params;

  const madeBooking = await models.booking.findByPk(bookingId);
  if (madeBooking.dataValues.status !== "Pending") {
    return res.status(400).json({
      status: 400,
      error: "Center already paid for or declined by admin",
    });
  }

  if (madeBooking.dataValues.referrence === null) {
    return res.status(400).json({
      status: 400,
      error: "Payment has not been initialized for this booking",
    });
  }
  const REFERENCE = madeBooking.dataValues.referrence;

  let requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const verify = await fetch(
      `https://api.paystack.co/transaction/verify/${REFERENCE}`,
      requestOptions
    );
    const response = await verify.json();
    // if success, change status to Paid, set the amount_paid, set paid_at, set channel,
    if (response.data.status === "success") {
      await models.booking.update(
        {
          status: "Paid",
          amount_paid: response.data.amount,
          paid_at: response.data.paid_at,
          channel: response.data.channel,
        },
        {
          where: {
            id: bookingId,
          },
        }
      );

      return res.status(200).json({
        status: 200,
        message: "Payment successful",
        response,
      });
    }

    return res.status(400).json({
      status: 400,
      error: "Payment verification failed",
      response,
    });
  } catch (error) {
    return next(error);
  }
};

const customerViewBookings = async (req, res, next) => {
  const { id } = req.user;
  const results = await models.booking.findAll({
    include: { model: models.Centers },
    where: { customerId: id },
  });

  return res.status(200).json({
    status: 200,
    message: results,
  });
};

const singleBooking = async (req, res, next) => {
  try {
    const booking_id = req.params.bookingId;
    const booking = await models.booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({
        status: 404,
        error: "Booking does not exist",
      });
    }
    return res.status(200).json({
      status: 200,
      booking,
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const pendingBookings = async (req, res, next) => {
  const { id } = req.user;
  try {
    const results = await models.booking.findAll({
      attributes: [
        "status",
        "event_date",
        "from_time",
        "to_time",
        "purpose",
        "additional_info",
        "amount_paid",
        "balance",
        "paid_at",
        "channel",
        ["createdAt", "date of booking"],
      ],
      where: { customerId: id, status: "Pending" },
    });
    return res.status(200).json({
      status: 200,
      message: results,
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const paidBookings = async (req, res, next) => {
  const { id } = req.user;
  try {
    const results = await models.booking.findAll({
      attributes: [
        "status",
        "event_date",
        "from_time",
        "to_time",
        "purpose",
        "additional_info",
        "amount_paid",
        "balance",
        "paid_at",
        "channel",
        ["createdAt", "date of booking"],
      ],
      where: { customerId: id, status: "Paid" },
    });
    return res.status(200).json({
      status: 200,
      message: results,
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};
const pastBookings = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: 200,
      message: "See past bookings here",
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};

export {
  makeBooking,
  cancelBooking,
  initializePayment,
  verifyPayment,
  customerViewBookings,
  singleBooking,
  pendingBookings,
  paidBookings,
  pastBookings,
};
