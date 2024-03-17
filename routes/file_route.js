const multer = require("multer");
const upload = multer({ dest: "./uploads" });



module.exports = (app)=>{
    const fileController=require('../controller/fileController');
   app.post("/upload-file", upload.single("image"), fileController.uploadFile);
}