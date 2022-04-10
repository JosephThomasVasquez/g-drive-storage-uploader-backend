const express = require("express");
const dotenv = require("dotenv");
const { google } = require("googleapis");

dotenv.config();

const app = express();

app.use(express.json());

// Sets server port to 5000 unless a port is already assigned.
const { PORT = 5000 } = process.env;

// Listen on server
const listener = (req, res) => {
  console.log(`Server running on port ${PORT}`);
  //   console.log(serverOkLog(`Server running on port ${PORT}`));
};

app.listen(PORT, listener);
