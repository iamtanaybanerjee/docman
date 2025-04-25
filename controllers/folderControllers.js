const { validateFolderBodyParams } = require("../validations/validations");
const { createNewFolder } = require("../services/folderServices");

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

module.exports = { createFolder };
