const booksRouter = require("./books");
const usersRouter = require("./users");
const authRouter = require("./auth");
const borrowingRouter = require("./borrowing");

const setupRoutes = (app) => {
  app.use("/api/books", booksRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/borrowing", borrowingRouter);
};
module.exports = {
  setupRoutes,
};
