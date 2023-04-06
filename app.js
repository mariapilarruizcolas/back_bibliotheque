const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
const cookieParser = require("cookie-parser");
const { setupRoutes } = require("./routes");

app.use(express.json());
app.use(cookieParser());

app.use(cors());

setupRoutes(app);
module.exports = app;
