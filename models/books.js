const connection = require('../db-config');
const Joi = require('joi');

const db = connection.promise();
const validate = (data, forCreation = true) => {

    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
        title: Joi.string().max(255).required(),
        author: Joi.string().max(255).required(),
        isFree: Joi.string().required(),
    }).validate(data, { abortEarly: false }).error;
};




const getAllBooks = () => {
    return db.query('SELECT * FROM books');
};
const findOne = (id) => {
    return db
        .query('SELECT * FROM books WHERE bookId = ?', [id])
        .then(([results]) => results[0]);
};
const putOneBookById = (newAttributes, id) => {
    return db.query('UPDATE books SET ? WHERE bookId = ?', [newAttributes, id]);
};


const addingOneBook = ({ title, author, isFree }) => {

    return db.query(
        'INSERT INTO books (title, author, isFree) VALUES (?,?,?)',
        [title, author, isFree])
        .then(([result]) => {
            const bookId = result.insertId;
            return { title, author, isFree, bookd };
        });
};



const destroy = (id) => {
    return db
        .query('DELETE FROM books WHERE bookId = ?', [id])
        .then(([result]) => result.affectedRows !== 0);
};




module.exports = { getAllBooks, addingOneBook, putOneBookById, validate, findOne, destroy };
