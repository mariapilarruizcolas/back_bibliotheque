// server.js
const app = require("./app");

const server = app.listen(3001, () => {
  console.log("Server started on port 3001");
});

module.exports = server;
