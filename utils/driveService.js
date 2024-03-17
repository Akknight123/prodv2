const { google } = require("googleapis");
const apikeys = require('../keys/nodejs-project-412709-5be41c13d4ac.json');

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile:  apikeys ,
  scopes: SCOPES,
});

module.exports = google.drive({ version: "v3", auth: auth });
