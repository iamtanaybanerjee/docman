const express = require("express");
const upload = require("../middleware/multer_config");
const {
  uploadFile,
  updateFile,
  deleteFile,
} = require("../controllers/fileControllers");
const multer = require("multer");
const UNEXPECTED_FILE_TYPE = require("../constants/error_constants");

const fileRouter = express.Router({ mergeParams: true });

fileRouter.use((req, res, next) => {
  // console.log("fileRouter middleware - req.params:", req.params); // Should show folderId
  next();
});

fileRouter.post(
  "/files",
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === UNEXPECTED_FILE_TYPE.code) {
          // return res.status(400).json({ error: UNEXPECTED_FILE_TYPE.message });
          return res.status(400).json({ error: { description: err.field } });
        }
      } else if (err) {
        return res.status(500).json({ error: { description: err.message } });
      }

      next();
    });
  },
  uploadFile
);

fileRouter.put("/files/:fileId", updateFile);

fileRouter.delete("/files/:fileId", deleteFile);

module.exports = fileRouter;
