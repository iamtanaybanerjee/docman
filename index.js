const express = require("express");
const cors = require("cors");
const {
  createFolder,
  updateFolder,
  deleteFolder,
  getAllFolders,
} = require("./controllers/folderControllers");
const { getFilesByType } = require("./controllers/fileControllers");
const { uploadFile } = require("./controllers/fileControllers");
const { sequelize } = require("./models");
const fileRouter = require("./router/fileRouter");
require("pg");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Docman API</title>
      </head>
      <body>
        <h1>Welcome to the Docman Backend</h1>
        <p>This is the backend server. Please use the API routes to interact with the service.</p>
      </body>
    </html>
  `);
});
app.post("/folder/create", createFolder);
app.put("/folders/:folderId", updateFolder);
app.delete("/folders/:folderId", deleteFolder);
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
// Mount the fileRouter with parameter logging
app.use(
  "/folders/:folderId",
  (req, res, next) => {
    next();
  },
  fileRouter
);
app.get("/folders", getAllFolders);
app.get("/files", getFilesByType);

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("unable to connect to database", error));

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
