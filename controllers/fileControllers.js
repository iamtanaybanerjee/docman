const {
  cloudinaryUpload,
  createFile,
  updateFileDescription,
  deleteExistingFile,
  getFiles,
  sortFiles,
} = require("../services/fileServices");
const {
  validateFolderId,
  validateFileTypeAndSize,
  validateFolderMaxFileLimit,
  validateIfFileExistInFolder,
} = require("../validations/validations");

const uploadFile = async (req, res) => {
  const folderId = req.params.folderId;
  //   const file = req.files[0];
  const file = req.file;
  const description = req.body.description;

  try {
    if (
      !req.file ||
      (Array.isArray(req.files) && req.files.length === 0) ||
      (typeof req.files === "object" && Object.keys(req.files).length === 0)
    ) {
      return res.status(400).json({
        error: "No file is sent in the request or there's a client-side error",
      });
    }

    const error = await validateFolderId(folderId);
    if (error) return res.status(404).json({ error });

    console.log("file.mimetype:", file.mimetype);

    const errors = await validateFileTypeAndSize(folderId, file);
    if (errors.length > 0) return res.status(400).json({ errors });

    const error2 = await validateFolderMaxFileLimit(folderId);
    if (error2) return res.status(400).json({ error: error2 });

    const result = await cloudinaryUpload(file);
    const response = await createFile(file, description, folderId);

    return res.status(200).json({
      message: "File uploaded successfully!",
      uploadResult: result,
      response,
    });
  } catch (error) {
    console.log("uploadFile error", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateFile = async (req, res) => {
  const fileId = req.params.fileId;
  const folderId = req.params.folderId;
  const body = req.body;
  try {
    const error = await validateIfFileExistInFolder(fileId, folderId);
    if (error) return res.status(400).json({ error });

    const fileObj = await updateFileDescription(fileId, body);
    return res.status(200).json({
      message: "File description updated successfully",
      file: fileObj,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteFile = async (req, res) => {
  const fileId = req.params.fileId;
  const folderId = req.params.folderId;
  try {
    const error = await validateIfFileExistInFolder(fileId, folderId);
    if (error) return res.status(400).json({ error });

    const response = await deleteExistingFile(fileId);

    if (!response.message)
      return res.status(404).json({ error: "File not found" });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getFilesInFolder = async (req, res) => {
  const folderId = req.params.folderId;
  try {
    const files = await getFiles(folderId);

    if (files.length === 0)
      return res.status(404).json({ message: "No files are found" });

    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const sortFilesInFolder = async (req, res) => {
  const folerId = req.params.folderId;
  const sortParam = req.query.sort;
  try {
    const error = await validateFolderId(folerId);
    if (error)
      return res
        .status(404)
        .json({ message: `No folder found with id ${folerId}` });

    const files = await sortFiles(folerId, sortParam);

    if (files.length === 0)
      return res.status(404).json({ message: "No files found" });

    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
  updateFile,
  deleteFile,
  getFilesInFolder,
  sortFilesInFolder,
};
