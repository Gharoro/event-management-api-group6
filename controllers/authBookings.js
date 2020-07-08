import models from '../models';
const makeBooking = async(req, res, next)=> {
  const {event_date, from, to, purpose, additional_info} = req.body
  const {customerId} = req.user.customerId;
  //get center id 
return res.status(200).json({message: "Yet another controller"})
}

export { makeBooking };