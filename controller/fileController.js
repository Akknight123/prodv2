require("dotenv").config();
const fs = require("fs");
const { google } = require("googleapis");
const driveService = require("../utils/driveService");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const apikeys = require("../keys/nodejs-project-412709-5be41c13d4ac.json");
// controller to upload files
async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

const uploadFileA = async (req, res) => {
  const image = req.file;
  console.log(req.file);
  if (req.file == undefined) {
    res.status(200).json({
      status: false,
      message: "Profile image uploaded successfully!!",
    });
  } else {
    try {
      // as the file name stored is gibberish with no extension, that file is replaced by the original filename
      await fs.promises.rename(
        image.destination + "/" + image.filename,
        image.destination + "/" + image.originalname
      );

      const metaData = {
        name: image.originalname.substring(
          0,
          image.originalname.lastIndexOf(".")
        ),
        parents: [process.env.FOLDER_ID], // the ID of the folder you get from createFolder.js is used here
      };

      const media = {
        mimeType: image.mimeType,
        body: fs.createReadStream(image.destination + "/" + image.originalname), // the image sent through multer will be uploaded to Drive
      };
      var authClient = await authorize();
      const drive = google.drive({ version: "v3", auth: authClient });
      // uploading the file
      const response = await drive.files.create({
        resource: metaData,
        media: media,
        fields: "id",
      });

      console.log("ID:", response.data.id);
      //   res.status(200).json({
      //     status: true,
      //     id:response.data.id,
      //     message: "Profile image uploaded successfully!!",
      //     data: response,
      // });
      // res.send(response);
      return response;
    } catch (err) {
      console.log(err);
      // res.send(err);
      res.status(400).json({
        status: false,
        message: "catch block error",
        err,
      });
    }
  }
};

const getAllFiles = async (req, res) => {
  try {
    const q = `'${process.env.FOLDER_ID}' in parents`;
    const response = await driveService.files.list({
      q: q, // comment this if you want all possible files
      fields: "files(id, name)",
    });
    res.send(response.data);
  } catch (err) {
    res.send(err);
  }
};

const deleteFile = async (req, res) => {
  const fileId = req.body.fileId; // the file to delete
  const response = await driveService.files.delete({
    fileId: fileId,
    parentId: `${process.env.FOLDER_ID}`,
  });
  res.send(response);
};

const updateFile = async (req, res) => {
  try {
    const image = req.file; // the file to replace with
    const fileId = req.body.fileId; // the file to be replaced
    await fs.promises.rename(
      image.destination + "/" + image.filename,
      image.destination + "/" + image.originalname
    );
    const media = {
      mimeType: image.mimeType,
      body: fs.createReadStream(image.destination + "/" + image.originalname), // the image sent through multer will be uploaded to Drive
    };

    const response = await driveService.files.update({
      resource: { name: image.originalname },
      addParents: `${process.env.FOLDER_ID}`,
      fileId: fileId,
      media: media,
      fields: "id",
    });

    res.send(response);
  } catch (err) {
    res.send(err);
  }
};
const uploadFile = async (req, res) => {
  const image = req.file;
  try {
    // A Function that will upload the desired file to google drive folder
    async function uploadFileFunc(authClient) {
      return new Promise((resolve, rejected) => {
        const drive = google.drive({ version: "v3", auth: authClient });
        var fileMetaData = {
          name: image.originalname.substring(
            0,
            image.originalname.lastIndexOf(".")
          ),
          parents: [process.env.FOLDER_ID], // the ID of the folder you get from createFolder.js is used here
        }; /* = {
          name:'my1drivetext.txt',    
          parents:['1qGnjuyM0jr2LQeOEkQqROOdauhE3GWgi'] // A folder ID to which file will get uploaded
      } */

        drive.files.create(
          {
            resource: fileMetaData,
            media: {
              mimeType: image.mimeType,
              body: fs.createReadStream(
                image.destination + "/" + image.originalname
              ), // the image sent through multer will be uploaded to Drive
            },
            fields: "id",
          },
          function (error, file) {
            if (error) {
              res.status(400).json({
                status: false,
                message: "catch block error",
                error,
              });
              return rejected(error);
            }
            resolve(file);
            console.log("value", file);
            console.log("image", image.body);
            res.status(200).json({
              status: true,
              id: file.data.id,
              message: "Profile image uploaded successfully!!",
            });
          }
        );
      });
    }
    authorize().then(uploadFileFunc).catch("error", console.error());
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "catch block error",
    });
  }
};

module.exports = {
  uploadFile: uploadFileA, //uploadFile,
  deleteFile: deleteFile,
  updateFile: updateFile,
  getAllFiles: getAllFiles,
  authorize: authorize,
};
