const { cloudinaryUpload, createFile } = require("../services/fileServices");
const {
  validateFolderId,
  validateFileTypeAndSize,
  validateFolderMaxFileLimit,
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

module.exports = { uploadFile };
