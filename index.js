// index.js
// const app = require('./app');

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

const app = require("./app");
const startServer = require("./startServer");

startServer(app);

// const server = app.listen(3000, (err) => {
//   if (err) {
//     throw new Error(`An error occurred: ${err.message}`);
//   }
//   console.log(`Server is listening on ${port}`);
// });

// module.exports = server;
