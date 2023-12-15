// server.js
const app = require("./app");

const server = app.listen(8000, () => {
  console.log("Server started on port 8000");
});

module.exports = server;
