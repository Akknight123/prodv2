const express = require("express");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const uploadModules = require("./controller/common_uploader")
const { uploadLocal } = require("./middleware/multer_modules");

// create express app */
const app = express();
app.use(
  cors({
    origin: "*",
    allowedHeaders: "X-Requested-With, Content-Type, auth-token",
  })
);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

// Configuring the database
// const dbConfig = require('./config/database.config.js');
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// define a simple route
app.get("/", (req, res) => {
  res.send("Hello from prod v2...;)");
});

require("./routes/video_route")(app);
require("./routes/category_routes")(app);
require("./routes/subcategory_routes")(app);
require("./routes/login_route")(app);
require("./routes/playlist_routes")(app);
require("./routes/dashboard")(app);
require("./routes/file_route")(app);
require("./routes/user_route")(app);

app.post("/upload-img", uploadLocal.single("image"), async function (req, res) {
  try {
    var data = await uploadModules.uploadToDrive(req.file, process.env.FOLDERID);
    var image = req.file
    // console.log("file,image", image.stream);
    res.status(200).json({
      status: true,
      message: "Profile image uploaded successfully!!",
      data: image.path,
      name: req.body.name,
      upData: data
    });
  } catch (error) {
    res.status(200).json({
      status: false,
      message: error.message || "Something went wrong!",

    });
  }

});

// listen for requests
app.listen(port, () => {
  console.log("Server is listening on port ", port);
});
