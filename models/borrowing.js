const connection = require('../db-config');
const db = connection.promise();
const Joi = require('joi');


const validate = (data, forCreation = true) => {

    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
        userId: Joi.number().presence(presence),
        bookId: Joi.number().presence(presence),
        deadlineDate: Joi.date().presence(presence),
        isRendered: Joi.string().max(4).presence(presence),

    }).validate(data, { abortEarly: false }).error;
};



const createOneBorrowing = ({ userId, bookId, deadlineDate, isRendered }) => {

    return db

        .query('INSERT INTO borrowing (userId, bookId, deadlineDate, isRendered) VALUES (?, ?, ?, ?) ', [
            userId,
            bookId,
            deadlineDate,
            isRendered
        ])
        .then(([result]) => {
            const id = result.insertId;
            return { userId, bookId, deadlineDate, isRendered };
        });

};

const getBorrowingByUserId = (id) => {
    return db.query('SELECT books.title, books.author, borrowing.deadlineDate, borrowing.userId, borrowing.bookId FROM books INNER JOIN borrowing ON books.bookId=borrowing.bookId WHERE borrowing.userId = ?; ', [id]);

};

const getBorrowingByBookId = (id) => {
    return db.query('SELECT borrowing.bookId, borrowingId, borrowing.isRendered, books.isFree FROM books INNER JOIN borrowing ON books.bookId=borrowing.bookId WHERE borrowing.bookId = ?; ', [id])
        .then(([results]) => results[0]);
};

const returnBook = (newAttributes, id) => {
    return db.query('UPDATE borrowing, books SET ? where borrowing.bookId = ?', [newAttributes, id])

};

module.exports = {
    validate, createOneBorrowing, getBorrowingByUserId,
    returnBook, getBorrowingByBookId
};
