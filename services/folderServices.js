const { Folder: FolderModel } = require("../models");

const createNewFolder = async (folderObj) => {
  try {
    const newFolderObj = await FolderModel.create(folderObj);
    return newFolderObj;
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewFolder };
