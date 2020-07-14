import models from "../models/index";
import {
  Op
} from "sequelize";

const addCenter = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: 403,
      message: "You are not allowed to access this resource",
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
      message: "Please fill all fields",
    });
  }
  if (image === undefined) {
    return res.status(400).json({
      status: 400,
      message: "Please upload a picture of your event center",
    });
  }
  if (allowedTypes.indexOf(image.mimetype) === -1) {
    return res.status(400).json({
      status: 400,
      message: "Please upload a jpg, jpeg or png file",
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
      images: image.path,
    });
    if (createCenter) {
      // return a success message on completion
      return res.json({
        status: 200,
        message: "Center created successfully",
        center: createCenter,
      });
    }
    // return an error message on failure
    return res.status(500).json({
      status: 500,
      message: "Unable to create center at the moment",
    });
  } catch (error) {
    return next(error);
  }
};

const viewAllCenters = async (req, res, next) => {
  try {
    const centers = await models.Centers.findAll();
    if (centers.length < 1) {
      return res.status(404).json({
        status: 404,
        error: 'There are no centers at the moment',
      });
    }
    return res.status(200).json({
      status: 200,
      centers,
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
        error: "Center does not exist",
      });
    }
    const arr = center.dataValues.dates_unavailable;
    let j = arr.length;
    while (j--) {
      const centDate = new Date(arr[j]);
      const d = Date.now();
      const currDate = new Date(d);
      if (currDate > centDate) {
        arr.splice(j, 1);
      }
    }
    await models.Centers.update({
        dates_unavailable: arr
      }, {
        where: {
          id
        }
      } //where id = req.params.id
    );
    return res.status(200).json({
      status: 200,
      center,
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const deleteCenter = async (req, res, next) => {
  try {
    const id = req.params.id;
    //find center by id
    const center = await models.Centers.findByPk(id);
    //if center with the id does not exit return error
    if (!center) {
      return res.status(404).json({
        status: 404,
        error: `Center with id:${id} does not exist`,
      });
    }
    if (center.manager_id !== req.user.id) {
      return res.status(403).json({
        status: 403,
        error: "You are not allowed to delete this center",
      });
    }
    center.destroy();
    return res.status(200).json({
      status: 200,
      message: "center successfully deleted",
    });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const updateCenter = async (req, res, next) => {
  const id = req.params.id;
  let {
    name,
    description,
    capacity,
    facilities,
    location,
    price
  } = req.body;
  const image = req.file;
  const allowedTypes = ["image/png", "image/jpeg"];
  // Retrieve the center information
  const center = await models.Centers.findByPk(id);
  if (!center) {
    return res.status(404).json({
      status: 404,
      error: `Center with id:${id} does not exist`,
    });
  }
  // Validations using tenary operators
  name = (name === undefined || name === '') ? center.dataValues.name : name;
  description = (description === undefined || description === '') ? center.dataValues.description : description;
  capacity = (capacity === undefined || capacity === '') ? center.dataValues.capacity : capacity;
  facilities = (facilities === undefined || facilities === '') ? center.dataValues.facilities : facilities;
  location = (location === undefined || location === '') ? center.dataValues.location : location;
  price = (price === undefined || price === '') ? center.dataValues.price : price;

  // if no image was selected, do not update the image url
  if (image === undefined) {
    try {
      const updatedCenter = await models.Centers.update({
          name,
          description,
          capacity,
          facilities,
          location,
          price,
          images: center.dataValues.images,
        }, {
          where: {
            id
          }
        } //where id = req.params.id
      );
      if (updatedCenter) {
        // return a success message on completion
        return res.json({
          status: 200,
          message: "Center updated successfully"
        });
      }
      // return an error message on failure
      return res.status(500).json({
        status: 500,
        message: "Unable to update center at the moment",
      });

    } catch (error) {
      return next(error);
    }

  }

  // if a new image was selected, update the center image with the new one
  if (allowedTypes.indexOf(image.mimetype) === -1) {
    return res.status(400).json({
      status: 400,
      message: "Please upload a jpg, jpeg or png file",
    });
  }
  try {
    const updatedCenter = await models.Centers.update({
        name,
        description,
        capacity,
        facilities,
        location,
        price,
        images: image.path,
      }, {
        where: {
          id
        }
      } //where id = req.params.id
    );
    if (updatedCenter) {
      // return a success message on completion
      return res.json({
        status: 200,
        message: "Center updated successfully"
      });
    }
    // return an error message on failure
    return res.status(500).json({
      status: 500,
      message: "Unable to update center at the moment",
    });
  } catch (error) {
    return next(error);
  }
};

const setUnavailableDates = async (req, res, next) => {
  const id = req.params.id;
  const {
    date
  } = req.body;
  if (!date) {
    return res.status(400).json({
      status: 400,
      error: 'Date is required'
    });
  }
  // Retrieve the center information
  const center = await models.Centers.findByPk(id);
  if (!center) {
    return res.status(404).json({
      status: 404,
      error: `Center with id:${id} does not exist`,
    });
  }
  let dateArr = center.dataValues.dates_unavailable;
  try {
    if (dateArr.indexOf(date) !== -1) {
      return res.status(400).json({
        status: 400,
        error: 'Center already marked for unavailable on this day'
      });
    }
    dateArr.push(date);
    const dateSet = await center.update({
      dates_unavailable: dateArr
    });
    if (dateSet) {
      return res.status(200).json({
        status: 200,
        message: `Success! Center will no longer be available for booking on ${date}`
      });
    }
    return res.status(500).json({
      status: 500,
      error: 'Unable to update center at the moment'
    });
  } catch (error) {
    return next(error);
  }
}

const removeDates = async (req, res, next) => {
  const id = req.params.id;
  const {
    date
  } = req.body;
  if (!date) {
    return res.status(400).json({
      status: 400,
      error: 'Date is required'
    });
  }
  // Retrieve the center information
  const center = await models.Centers.findByPk(id);
  if (!center) {
    return res.status(404).json({
      status: 404,
      error: `Center with id:${id} does not exist`,
    });
  }
  let dateArr = center.dataValues.dates_unavailable;
  try {
    const index = dateArr.indexOf(date);
    if (index === -1) {
      return res.status(400).json({
        status: 400,
        error: 'Center is already available on this day'
      });
    }
    dateArr.splice(index, 1);
    const dateSet = await center.update({
      dates_unavailable: dateArr
    });
    if (dateSet) {
      return res.status(200).json({
        status: 200,
        message: `Success! Center will now be available for booking on ${date}`
      });
    }
    return res.status(500).json({
      status: 500,
      error: 'Unable to update center at the moment'
    });
  } catch (error) {
    return next(error);
  }
}

export {
  addCenter,
  viewAllCenters,
  viewOneCenter,
  deleteCenter,
  updateCenter,
  setUnavailableDates,
  removeDates
};