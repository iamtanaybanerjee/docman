const { Folder: FolderModel } = require("../models");

const validateFolderBodyParams = async (body) => {
  const errors = [];
  if (!body.name || body.name === "")
    errors.push("Name is required and should not be empty string");
  const nameDoesExist = await checkName(body.name);
  if (nameDoesExist === true) errors.push("Name already exist");
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

module.exports = { validateFolderBodyParams };
