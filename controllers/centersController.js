import models from "../models/index";
import {
  Op
} from "sequelize";

const addCenter = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: 403,
      message: "You are not allowed to access this resource"
    });
  }

  const {
    name,
    description,
    capacity,
    facilities,
    location,
    price
  } = req.body;
  const manager_id = req.user.id;
  const image = req.file;
  const allowedTypes = ["image/png", "image/jpeg"];
  // Validations
  if (
    !name ||
    !description ||
    !capacity ||
    !facilities ||
    !location ||
    !price
  ) {
    return res.status(400).json({
      status: 400,
      message: "Please fill all fields"
    });
  }
  if (image === undefined) {
    return res.status(400).json({
      status: 400,
      message: "Please upload a picture of your event center"
    });
  }
  if (allowedTypes.indexOf(image.mimetype) === -1) {
    return res.status(400).json({
      status: 400,
      message: "Please upload a jpg, jpeg or png file"
    });
  }
  try {
    const createCenter = await models.Centers.create({
      manager_id,
      name,
      description,
      capacity,
      facilities,
      location,
      price,
      images: image.path
    });
    if (createCenter) {
      // return a success message on completion
      return res.json({
        status: 200,
        message: "Center created successfully",
        center: createCenter
      });
    }
    // return an error message on failure
    return res.status(500).json({
      status: 500,
      message: "Unable to create center at the moment"
    });
  } catch (error) {
    return next(error);
  }
};

const viewAllCenters = async (req, res, next) => {
  try {
    const centers = await models.Centers.findAll();
    return res.status(200).json({
      status: 200,
      centers
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const viewOneCenter = async (req, res, next) => {
  try {
    const id = req.params.id;
    const center = await models.Centers.findByPk(id);
    if (!center) {
      return res.status(404).json({
        status: 404,
        error: 'Center does not exist'
      });
    }

    return res.status(200).json({
      status: 200,
      center
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const searchCenter = async (req, res, next) => {
  // only date
  // only location
  // only capacity
  // date && location
  // date && capacity
  // location && capacity
  // Date, location && capacity
  let {
    date,
    location,
    capacity
  } = req.query;

  if (!date && !location && !capacity) {
    return res.status(400).json({
      status: 400,
      error: 'Please enter date, location or capacity of event center'
    });
  }

  try {
    // search by DATE only
    if (date && !location && !capacity) {
      const result = await models.Centers.findAndCountAll({
        where: {
          dates_unavailable: {
            [Op.contained]: [date],
          },
        }
      });
      if (result.count === 0) {
        return res.status(404).json({
          status: 404,
          error: 'No result found. Please refine your search and try again'
        });
      }
      return res.status(200).json({
        status: 200,
        data: result
      });
    }
    // search by LOCATION only
    if (location && !date && !capacity) {
      const result = await models.Centers.findAndCountAll({
        where: {
          location: location
        }
      });
      if (result.count === 0) {
        return res.status(404).json({
          status: 404,
          error: 'No result found. Please refine your search and try again'
        });
      }
      return res.status(200).json({
        status: 200,
        data: result
      });
    }
    // search by CAPACITY only
    if (capacity && !location && !date) {
      const result = await models.Centers.findAndCountAll({
        where: {
          capacity: capacity
        }
      });
      if (result.count === 0) {
        return res.status(404).json({
          status: 404,
          error: 'No result found. Please refine your search and try again'
        });
      }
      return res.status(200).json({
        status: 200,
        data: result
      });
    }
    // search by DATE and LOCATION
    if (date && location && !capacity) {
      const result = await models.Centers.findAndCountAll({
        where: {
          [Op.and]: [{
            dates_unavailable: {
              [Op.contained]: [date],
            },
          }, {
            location: location
          }],
        }
      });
      if (result.count === 0) {
        return res.status(404).json({
          status: 404,
          error: 'No result found. Please refine your search and try again'
        });
      }
      return res.status(200).json({
        status: 200,
        data: result
      });
    }
    // search by DATE and CAPACITY
    if (date && capacity && !location) {
      const result = await models.Centers.findAndCountAll({
        where: {
          [Op.and]: [{
              dates_unavailable: {
                [Op.contained]: [date],
              },
            },
            {
              capacity: capacity
            }
          ],
        }
      });
      if (result.count === 0) {
        return res.status(404).json({
          status: 404,
          error: 'No result found. Please refine your search and try again'
        });
      }
      return res.status(200).json({
        status: 200,
        data: result
      });
    }
    // search by LOCATION and CAPACITY
    if (location && capacity && !date) {
      const result = await models.Centers.findAndCountAll({
        where: {
          [Op.and]: [{
            location: location
          }, {
            capacity: capacity
          }],
        }
      });
      if (result.count === 0) {
        return res.status(404).json({
          status: 404,
          error: 'No result found. Please refine your search and try again'
        });
      }
      return res.status(200).json({
        status: 200,
        data: result
      });
    }
    // search by DATE, LOCATION and CAPACITY
    if (date && location && capacity) {
      const result = await models.Centers.findAndCountAll({
        where: {
          [Op.and]: [{
            dates_unavailable: {
              [Op.contained]: [date],
            },
          }, {
            location: location
          }, {
            capacity: capacity
          }],
        }
      });
      if (result.count === 0) {
        return res.status(404).json({
          status: 404,
          error: 'No result found. Please refine your search and try again'
        });
      }
      return res.status(200).json({
        status: 200,
        data: result
      });
    }
  } catch (error) {
    return next(error);
  }
}

const newSearch = async (req, res, next) => {
  // let {
  //   date,
  //   location,
  //   capacity
  // } = req.query;
  // // if (!date && !location && !capacity) {
  // //   return res.status(400).json({
  // //     status: 400,
  // //     error: 'Please enter date, location or capacity of event center'
  // //   });
  // // }
  // let x = [];
  // const result = await models.Centers.findAll();
  // // console.log(result[0].dataValues.dates_unavailable);
  // for (let i = 0; i < result.length; i++) {
  //   // only date
  //   if (result[i].dataValues.dates_unavailable.indexOf(date) === -1) {
  //     x.push(result[i]);
  //   }

  //   if (result[i].dataValues.dates_unavailable.indexOf(date) === -1 && result[i].dataValues.location === location) {
  //     x.push(result[i]);
  //   }

  //   if (result[i].dataValues.location === location) {
  //     x.push(result[i]);
  //   }
  // }

  // return res.json({
  //   result: x
  // })
}


export {
  addCenter,
  viewAllCenters,
  viewOneCenter,
  searchCenter,
  newSearch
};