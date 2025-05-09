const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs/promises");
const { File: FileModel } = require("../models");
const { Op } = require("sequelize");

const cloudinaryUpload = async (file) => {
  try {
    // let result = await uploadToCloudinary(file.path);
    let result = await uploadToCloudinary(file.buffer);
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
      size: (file.size / (1024 * 1024)).toFixed(2),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const updateFileDescription = async (fileId, body) => {
  try {
    const fileObj = await FileModel.findOne({ where: { fileId } });

    fileObj.set(body);
    const updatedFileObj = await fileObj.save();

    return updatedFileObj;
  } catch (error) {
    throw error;
  }
};

const deleteExistingFile = async (fileId) => {
  try {
    const response = await FileModel.destroy({ where: { fileId } });

    if (response === 0) return {};

    return { message: "File deleted successfully!" };
  } catch (error) {
    throw error;
  }
};

const getFiles = async (folderId) => {
  try {
    const files = await FileModel.findAll({ where: { folderId } });
    return files;
  } catch (error) {
    throw error;
  }
};

const sortFiles = async (folderId, sortParam) => {
  try {
    const files = await FileModel.findAll({
      where: { folderId },
      order: [[sortParam, "ASC"]],
    });
    return files;
  } catch (error) {
    throw error;
  }
};

const getFilesByTypeAcrossFolders = async (type) => {
  try {
    const files = await FileModel.findAll({
      where: {
        type: {
          [Op.iLike]: `%${type}%`,
        },
      },
    });
    return files;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  cloudinaryUpload,
  createFile,
  updateFileDescription,
  deleteExistingFile,
  getFiles,
  sortFiles,
  getFilesByTypeAcrossFolders,
};
