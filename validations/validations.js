const { Folder: FolderModel, File: FileModel } = require("../models");

const mimeToFolderType = {
  "image/png": "img",
  "image/jpeg": "img",
  "image/jpg": "img",
  "image/webp": "img",
  "image/gif": "img",
  "application/pdf": "pdf",
  "text/csv": "csv",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "ppt", // pptx
};

const validateFolderBodyParams = async (body) => {
  const errors = [];
  if (!body.name || body.name === "")
    errors.push("Name is required and should not be empty string");
  else {
    const nameDoesExist = await checkName(body.name);
    if (nameDoesExist === true) errors.push("Name already exist");
  }

  // if (nameDoesExist === true) errors.push("Name already exist");
  if (!body.type || body.type === "")
    errors.push("Type is required and must not be an empty string");
  if (
    !(
      body.type === "csv" ||
      body.type === "img" ||
      body.type === "pdf" ||
      body.type === "ppt"
    )
  )
    errors.push("Type must be one of csv, img, pdf, ppt");
  if (
    !body.maxFileLimit ||
    body.maxFileLimit <= 0 ||
    typeof body.maxFileLimit !== "number" ||
    isNaN(body.maxFileLimit)
  )
    errors.push("maxFileLimit is required and must be a positive integer");
  return errors;
};

const checkName = async (name) => {
  const folderObj = await FolderModel.findOne({ where: { name } });
  if (!folderObj) return false;
  return true;
};

const validateUpdateFolderBody = async (body) => {
  const errors = [];
  if (body.name === "") errors.push("Name should not be empty");
  else if (body.name) {
    const nameDoesExist = await checkName(body.name);
    if (nameDoesExist === true) errors.push("Name already exist");
  }
  if (body.type) {
    if (
      body.type === "" ||
      !(
        body.type === "csv" ||
        body.type === "pdf" ||
        body.type === "img" ||
        body.type === "ppt"
      )
    )
      errors.push(
        "Type cannot be empty string and should be one of csv, img, pdf, ppt"
      );
  }
  if (
    body.maxFileLimit <= 0 ||
    typeof body.maxFileLimit !== "number" ||
    isNaN(body.maxFileLimit)
  ) {
    errors.push("maxFileLimit must be a positive integer");
  }
  return errors;
};

const validateFolderId = async (folderId) => {
  console.log("Inside validateFolderId - folderId:", folderId);
  let error;
  const folderObj = await FolderModel.findOne({ where: { folderId } });
  if (!folderObj) error = `No folder found for id ${folderId}`;
  return error;
};

const validateFileTypeAndSize = async (folderId, file) => {
  const errors = [];
  try {
    const fileSizeMB = file.size / (1024 * 1024);
    const folderObj = await FolderModel.findOne({ where: { folderId } });

    const expectedFolderType = mimeToFolderType[file.mimetype];

    if (expectedFolderType !== folderObj.type)
      errors.push(
        `Mismatch: Cannot upload a file type ${expectedFolderType} to a folder type ${folderObj.type}`
      );
    if (fileSizeMB > 10) errors.push("File size is greater than 10MB");

    return errors;
  } catch (error) {
    throw error;
  }
};

const validateFolderMaxFileLimit = async (folderId) => {
  let error;
  const folderObj = await FolderModel.findOne({ where: { folderId } });
  const fileObjectList = await FileModel.findAll({ where: { folderId } });

  if (fileObjectList.length === folderObj.maxFileLimit)
    error = "File-limit: Cannot upload as max-file-limit has been reached";

  return error;
};

const validateIfFileExistInFolder = async (fileId, folderId) => {
  let error;
  try {
    const fileObj = await FileModel.findOne({ where: { fileId } });

    if (!fileObj) error = `No file exist with id ${fileId}`;
    else if (fileObj.folderId !== folderId)
      error = "File does not exist in this folder";

    return error;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validateFolderBodyParams,
  validateUpdateFolderBody,
  validateFolderId,
  validateFileTypeAndSize,
  validateFolderMaxFileLimit,
  validateIfFileExistInFolder,
};
