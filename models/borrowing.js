const connection = require('../db-config');
const db = connection.promise();
const Joi = require('joi');


const validate = (data, forCreation = true) => {

    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
        userId: Joi.number().presence(presence),
        bookId: Joi.number().presence(presence),
        deadlineDate: Joi.date().presence(presence),


    }).validate(data, { abortEarly: false }).error;
};



const createOneBorrowing = ({ userId, bookId, deadlineDate }) => {

    return db

        .query('INSERT INTO borrowing (userId, bookId, deadlineDate) VALUES (?, ?, ?) ', [
            userId,
            bookId,
            deadlineDate,

        ])
        .then(([result]) => {
            const borrowingId = result.insertId;
            return { userId, bookId, deadlineDate, borrowingId };
        });

};

const getBorrowingByUserId = (id) => {
    return db.query('SELECT books.title, books.author, borrowing.deadlineDate, borrowing.userId, borrowing.bookId FROM books INNER JOIN borrowing ON books.bookId=borrowing.bookId WHERE borrowing.userId = ?; ', [id]);

};

const getBorrowingByBookId = (id) => {
    return db.query('SELECT borrowing.bookId, borrowingId, books.isFree FROM books INNER JOIN borrowing ON books.bookId=borrowing.bookId WHERE borrowing.bookId = ?; ', [id])
        .then(([results]) => results[0]);
};

const returnBook = (newAttributes, id) => {
    return db.query('UPDATE borrowing, books SET ? where borrowing.bookId = ?', [newAttributes, id])

};
const destroy = (id) => {
    return db
        .query('DELETE FROM borrowing WHERE bookId = ?', [id])
        .then(([result]) => result.affectedRows !== 0);
};


module.exports = {
    validate, createOneBorrowing, getBorrowingByUserId,
    returnBook, getBorrowingByBookId, destroy
};
