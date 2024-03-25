require("dotenv").config();
const fs = require("fs");
const { google } = require("googleapis");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const apikeys = require("../keys/nodejs-project-412709-5be41c13d4ac.json");
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
async function uploadToDrive(anyFile, folderPath) {
  const image = anyFile;
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
      parents: [folderPath], // the ID of the folder you get from createFolder.js is used here
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
      fields: "id"
    });
    drive.permissions.create({
      resource: {
        'type': 'anyone',
        'role': 'reader',
      },
      fileId: response.data.id,
      fields: 'id',
    });
    fs.unlink(image.destination + "/" + image.originalname, (err) => {
      if (err) {
        // console.log("file deleted err", image.destination + "/" + image.originalname);
      } else {
        // console.log("file deleted suces", image.destination + "/" + image.originalname);
      }
    })
    return response.data.id;
  } catch (err) {
    console.log(err);

    throw "Something went wrong!";
  }

}

async function getFile(anyFile) {
  try {
    var authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });
    // const file = await drive.files.get({
    //   fileId: anyFile,
    //   alt: 'media',
    // });
    // console.log("file : ", file);
    drive.permissions.create({
      resource: {
        'type': 'anyone',
        'role': 'reader',
      },
      fileId: anyFile,
      fields: 'id',
    }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      let webViewLink = `https://drive.google.com/open?id=${anyFile}`;
      console.log(`Publicly accessible link: ${webViewLink}`);
      return file.status;
    });

  } catch (err) {
    console.log("error get ", err)
    // TODO(developer) - Handle error
    throw err;
  }
}
module.exports = {
  uploadToDrive, getFile
}