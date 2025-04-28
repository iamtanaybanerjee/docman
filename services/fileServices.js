const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs/promises");
const { File: FileModel } = require("../models");

const cloudinaryUpload = async (file) => {
  try {
    let result = await uploadToCloudinary(file.path);
    await fs.unlink(file.path);
    return result;
  } catch (error) {
    throw error;
  }
};

const createFile = async (file, description, folderId) => {
  try {
    const response = await FileModel.create({
      folderId,
      name: file.originalname,
      description,
      type: file.mimetype,
      size: file.size / (1024 * 1024),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = { cloudinaryUpload, createFile };
