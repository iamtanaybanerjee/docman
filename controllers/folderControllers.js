const {
  validateFolderBodyParams,
  validateUpdateFolderBody,
} = require("../validations/validations");
const {
  createNewFolder,
  updateExistingFolder,
  deleteExistingFolder,
} = require("../services/folderServices");

const createFolder = async (req, res) => {
  const folderBody = req.body;
  try {
    const errors = await validateFolderBodyParams(folderBody);
    if (errors.length > 0) return res.status(400).json({ errors });

    const newFolderObj = await createNewFolder(folderBody);
    return res
      .status(201)
      .json({ message: "Folder created successfully", folder: newFolderObj });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateFolder = async (req, res) => {
  const body = req.body;
  const folderId = req.params.folderId;
  try {
    const errors = await validateUpdateFolderBody(body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const response = await updateExistingFolder(body, folderId);

    if (!response.message)
      return res
        .status(404)
        .json({ message: `No folder is found for id ${folderId}` });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteFolder = async (req, res) => {
  const folderId = req.params.folderId;
  try {
    const response = await deleteExistingFolder(folderId);

    if (!response.message)
      return res
        .status(404)
        .json({ message: `No folder is found with id ${folderId}` });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createFolder, updateFolder, deleteFolder };
