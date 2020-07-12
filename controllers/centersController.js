import models from "../models/index";
import { Op } from "sequelize";

const addCenter = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: 403,
      message: "You are not allowed to access this resource",
    });
  }

  const { name, description, capacity, facilities, location, price } = req.body;
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
      return res.status(403).json({
        status: 403,
        message: `Center with id:${id} does not exist`,
      });
    }
    if (center.manager_id !== req.user.id) {
      return res.status(403).json({
        status: 403,
        message: "You are not allowed to delete this center",
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
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: 403,
      message: "You are not allowed to update this resource",
    });
  }
  const id = req.params.id;
  const { name, description, capacity, facilities, location, price } = req.body;
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
    const updatedCenter = await models.Centers.update(
      {
        manager_id,
        name,
        description,
        capacity,
        facilities,
        location,
        price,
        images: image.path,
      },
      { where: { id } } //where id = req.params.id
    );
    if (updatedCenter) {
      // return a success message on completion
      return res.json({
        status: 200,
        message: "Center updated successfully",
        center: updatedCenter,
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
export { addCenter, viewAllCenters, viewOneCenter, deleteCenter, updateCenter };
