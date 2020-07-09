import models from "../models";
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
      return res.status(200).json({
        status: 200,
        success: "Booking successfull"
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

export { makeBooking };
