const express = require("express");
const cors = require("cors");
const {
  createFolder,
  updateFolder,
  deleteFolder,
} = require("./controllers/folderControllers");
const { sequelize } = require("./models");
require("pg");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/folder/create", createFolder);
app.put("/folders/:folderId", updateFolder);
app.delete("/folders/:folderId", deleteFolder);

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("unable to connect to database", error));

app.listen(3000, () => {
  console.log("Server is listening to port 3000");
});
