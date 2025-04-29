const { Folder: FolderModel } = require("../models");
const { getFiles } = require("./fileServices");

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

const getFolders = async () => {
  try {
    const folderList = await FolderModel.findAll();

    if (folderList.length === 0) return [];

    const folders = [];

    for (let i = 0; i < folderList.length; i++) {
      const fileList = await getFiles(folderList[i].folderId);
      folders.push({
        ...folderList[i].dataValues,
        files: fileList,
      });
    }
    return folders;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewFolder,
  updateExistingFolder,
  deleteExistingFolder,
  getFolders,
};
