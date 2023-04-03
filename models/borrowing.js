const connection = require("../db-config");
const db = connection.promise();
const Joi = require("joi");

const validateBorrowing = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    userId: Joi.number().presence(presence),
    bookId: Joi.number().presence(presence),
    deadlineDate: Joi.date().presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const createOneBorrowing = ({ userId, bookId, deadlineDate }) => {
  return db
    .query(
      "INSERT INTO borrowing (userId, bookId, deadlineDate) VALUES (?, ?, ?)",
      [userId, bookId, deadlineDate]
    )
    .then(([results]) => {
      const borrowingId = results.insertId;
      return { userId, bookId, deadlineDate, borrowingId };
    });
};

const getBorrowingByUserId = (id) => {
  return db
    .query(
      "SELECT books.title, books.author, borrowing.deadlineDate, borrowing.userId, borrowing.bookId FROM books INNER JOIN borrowing ON books.bookId=borrowing.bookId WHERE borrowing.userId = ?; ",
      [id]
    )
    .then(([results]) => {
      if (results.length === 0) {
        return [];
      }
      return results;
    });
};
const getBorrowingByBookId = (id) => {
  return db
    .query(
      "SELECT borrowing.bookId, borrowingId, books.isFree FROM books INNER JOIN borrowing ON books.bookId=borrowing.bookId WHERE borrowing.bookId = ?; ",
      [id]
    )
    .then(([results]) => {
      if (results.length === 0) {
        return [];
      }
      return results[0];
    });
};
const returnBook = (id) => {
  return db
    .query("UPDATE books SET isFree = 1 WHERE bookId = ?", [id])
    .then((result) => {
      const isFree = result.affectedRows === 1;
      return isFree;
    });
};

// 0 représente false et 1 représente true.
// 0 non et 1 yes
const borrowingBook = (id) => {
  return db.query("UPDATE books SET isFree = 0 WHERE bookId = ?", [id]);
};

const deleteBorrowing = (id) => {
  return db
    .query("DELETE FROM borrowing WHERE bookId = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  validateBorrowing,
  createOneBorrowing,
  getBorrowingByUserId,
  returnBook,
  borrowingBook,
  getBorrowingByBookId,
  deleteBorrowing,
};
