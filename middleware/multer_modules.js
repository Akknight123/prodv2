// This imports the multer module
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        const dateTime = Date.now();
        cb(null, `${dateTime}.${file.originalname.split(".")[1]}`);
    },
});

const uploadLocal = multer({storage});
module.exports = {
    uploadLocal
}