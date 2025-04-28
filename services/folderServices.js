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
  const folderObj = await FolderModel.findOne({ where: { folderId } });

  if (!folderObj) return {};

  folderObj.set(body);
  const updatedFolderObj = await folderObj.save();
  return { message: "Updated folder successfully!", folder: updatedFolderObj };
};

module.exports = { createNewFolder, updateExistingFolder };
