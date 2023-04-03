const connection = require("../db-config");
const Joi = require("joi");

const db = connection.promise();
const validateBook = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    title: Joi.string().max(255).required(),
    author: Joi.string().max(255).required(),
    isFree: Joi.boolean().required(),
  }).validate(data, { abortEarly: false }).error;
};

const getAllBooks = () => {
  return db.query("SELECT * FROM books");
};
const findOneBook = (id) => {
  return db
    .query("SELECT * FROM books WHERE bookId = ?", [id])
    .then(([results]) => {
      if (results.length === 0) {
        return [];
      }
      return results[0];
    });
};
// const putOneBookById = (id) => {
//   return db.query("UPDATE books SET isFree = 'yes' WHERE bookId = ?", [id]);
// };

const addingOneBook = ({ title, author, isFree }) => {
  const isFreeBool = isFree === "true";
  return db
    .query("INSERT INTO books (title, author, isFree) VALUES (?,?,?)", [
      title,
      author,
      isFreeBool,
    ])
    .then(([result]) => {
      const bookId = result.insertId;
      return { title, author, isFree: isFreeBool, bookId };
    });
};

const destroyBook = (id) => {
  return db
    .query("DELETE FROM books WHERE bookId = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  getAllBooks,
  addingOneBook,
  validateBook,
  findOneBook,
  destroyBook,
};
