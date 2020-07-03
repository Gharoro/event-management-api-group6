import { Router } from "express";
import models from "../../models";

const router = Router();

router.get("/api/customer", async (req, res, next) => {
  //get the profile for one particular customer
  //this includes booking history, images
  try {
    const result = await models.customer.findAll();
    console.log(req.body)
    return res.json({ message: result, status: 200 });
   
  } catch (error) {
    console.error();
    return next();
  }
});

export default router;
