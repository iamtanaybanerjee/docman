const { Folder: FolderModel } = require("../models");

const createNewFolder = async (folderObj) => {
  try {
    const newFolderObj = await FolderModel.create(folderObj);
    return newFolderObj;
  } catch (error) {
    throw error;
  }
};

const updateExistingFolder = async (body, folderId) => {
  try {
    const folderObj = await FolderModel.findOne({ where: { folderId } });

    if (!folderObj) return {};

    folderObj.set(body);
    const updatedFolderObj = await folderObj.save();
    return {
      message: "Updated folder successfully!",
      folder: updatedFolderObj,
    };
  } catch (error) {
    throw error;
  }
};

const deleteExistingFolder = async (folderId) => {
  try {
    const response = await FolderModel.destroy({ where: { folderId } });

    if (response === 0) return {};

    return {
      message: "Deleted folder successfully!",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewFolder,
  updateExistingFolder,
  deleteExistingFolder,
};
