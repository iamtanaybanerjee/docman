const { Folder: FolderModel, File: FileModel } = require("../models");
const { getFiles } = require("./fileServices");
const { Op } = require("sequelize");

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

    const files = await FileModel.findAll({
      where: { folderId },
      attributes: ["fileId"],
    });
    const fileIds = [];
    for (let i = 0; i < files.length; i++) {
      fileIds.push(files[i].fileId);
    }

    await FileModel.destroy({
      where: {
        fileId: {
          [Op.in]: fileIds,
        },
      },
    });

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
