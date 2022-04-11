const express = require("express");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();

app.use(express.json());

// Configure google OAuth2 ------------------------------------------------------------------------------------------------
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const refreshToken = process.env.REFRESH_TOKEN;
oauth2Client.setCredentials({ refresh_token: refreshToken });

// Google Drive ------------------------------------------------------------------------------------------------

// Drive config
const drive = google.drive({ version: "v3", auth: oauth2Client });
const filePath = path.join(__dirname, "Merc.jpg");

const deleteFile = async (fileId) => {
  //   Asynchronously delete the file from Google Drive
  try {
    const response = await drive.files.delete({ fileId });
    console.log("data | status:", response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
};

// Upload file to Drive
const uploadFile = async () => {
  // Create date for filename
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let today = new Date();
  let date = today.toLocaleDateString("en-US", options);
  let formattedDate = date.split(/[\s,]+/).join("-");

  //   Asynchronously upload the file to Google Drive
  try {
    const response = await drive.files.create({
      requestBody: {
        name: `${formattedDate}-fileName.jpg`,
        mimeType: "image/jpeg",
        parents: ["11qcg3x4jCguuVyCjJapzyyR4jIwyUF8y"], // Folder ID
      },
      media: {
        mimeType: "image/jpeg",
        body: fs.createReadStream(filePath),
      },
    });
    console.log(response.data);

    createPublicURL(response.data.id);
  } catch (error) {
    console.log(error.message);
  }
};

// Set permissions and create public URL
const createPublicURL = async (fileId) => {
  //   let fileId = "1awU6qBuAwDwUpptxWhWCi4jFF-5Tsj1C";

  try {
    // Set permissions
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId,
      fields: "webViewLink, webContentLink",
    });

    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
};

uploadFile();

// Sets server port to 5000 unless a port is already assigned.
const { PORT = 5000 } = process.env;

// Listen on server
const listener = (req, res) => {
  console.log(`Server running on port ${PORT}`);
  //   console.log(serverOkLog(`Server running on port ${PORT}`));
};

app.listen(PORT, listener);
