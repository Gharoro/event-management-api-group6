import models from '../models/index';

const addCenter = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 403,
      message: 'You are not allowed to access this resource',
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
  const allowedTypes = ['image/png', 'image/jpeg'];
  // Validations
  if (!name || !description || !capacity || !facilities || !location || !price) {
    return res.status(400).json({
      status: 400,
      message: 'Please fill all fields',
    });
  }
  if (image === undefined) {
    return res.status(400).json({
      status: 400,
      message: 'Please upload a picture of your event center',
    });
  }
  if (allowedTypes.indexOf(image.mimetype) === -1) {
    return res.status(400).json({
      status: 400,
      message: 'Please upload a jpg, jpeg or png file',
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
        message: 'Center created successfully',
        center: createCenter,
      });
    }
    // return an error message on failure
    return res.status(500).json({
      status: 500,
      message: 'Unable to create center at the moment',
    });
  } catch (error) {
    return next(error);
  }
};

export {
  addCenter
};