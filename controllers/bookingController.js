import models from "../models";


const makeBooking = async (req, res, next) => {
  const {
    event_date,
    from,
    to,
    purpose,
    additional_info
  } = req.body;

  if (!event_date || !from || !to || !purpose) {
    return res.status(400).json({
      status: 400,
      error: "all required fileds must be filled before booking an event"
    });
  }
  const customerId = req.user.id;
  const {
    centerId
  } = req.params;

  try {
    const findCenter = await models.Centers.findOne({
      where: {
        id: centerId
      }
    });

    if (!findCenter) {
      return res
        .status(404)
        .json({
          status: 404,
          error: "cannot book an event hall that does not exist"
        });
    }

    const dateArr = findCenter.dataValues.dates_unavailable;
    if (dateArr.indexOf(event_date) !== -1) {
      return res.status(400).json({
        status: 400,
        error: "Center already booked for this day"
      });
    }

    const booking = await models.booking.create({
      event_date,
      from,
      to,
      purpose,
      customerId,
      additional_info,
      centerId
    });
    if (booking) {
      dateArr.push(event_date);
      await findCenter.update({
        dates_unavailable: dateArr
      });

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

    const booking = await models.booking.findOne({
      where: {
        id: bookingId
      }
    });
    if (!booking) {
      return res.status(404).json({
        status: 404,
        error: "Invalid booking Id"
      });
    }

    const checkCustomer = await models.booking.findOne({
      where: {
        customerId
      }
    });

    if (!checkCustomer) {
      return res.status(403).json({
        status: 403,
        error: "Sorry you cannot cancel this booking"
      });
    }

    const findCenter = await models.Centers.findOne({
      where: {
        id: centerId
      }
    });
    const dateArr = findCenter.dataValues.dates_unavailable;
    // set booking status to cancel
    const deleteBooking = await models.booking.update({
      status: "cancelled"
    }, {
      where: {
        id: bookingId
      }
    });

    if (deleteBooking) {
      const index = dateArr.indexOf(checkCustomer.event_date);
      dateArr.splice(index, 1);
      await findCenter.update({
        dates_unavailable: dateArr
      });

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

export {
  makeBooking,
  cancelBooking
};