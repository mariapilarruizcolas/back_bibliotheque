const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
const cookieParser = require("cookie-parser");
const { setupRoutes } = require("./routes");

app.use(express.json());
app.use(cookieParser());

app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3001', // Remplacez par l'URL de votre application front-end
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   }));

setupRoutes(app);
module.exports = app;
