
const booksRouter = require('express').Router();
const Book = require('../models/books');

//Get all books
booksRouter.get('/', (req, res) => {
    Book.getAllBooks()
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((err) => {
            res.status(500).send('Error retrieving books');
        });
});

//Get by BookId
booksRouter.get('/:id', (req, res) => {
    Book.findOne(req.params.id)
        .then((book) => {
            res.status(200).json(book);
        })
        .catch((err) => {
            res.status(500).send('Error retrieving book');
        })
}
);

//Put One Book ex Not more Free
booksRouter.put('/:id', (req, res) => {
    let existingBook = null;
    let validationErrors = null;
    Book.findOne(req.params.id)
        .then((book) => {
            existingBook = book;
            if (!existingBook) return Promise.reject('RECORD_NOT_FOUND');
            // validationErrors = Movie.validate(req.body, false);
            // if (validationErrors) return Promise.reject('INVALID_DATA');
            return Book.putOneBookById(req.body, req.params.id);
        })
        .then(() => {
            res.status(200).json({ ...existingBook, ...req.body });
        })
        .catch((err) => {
            console.error(err);
            if (err === 'RECORD_NOT_FOUND')
                res.status(404).send(`Book with id ${req.params.id} not found.`);
            // else if (err === 'INVALID_DATA')
            //     res.status(422).json({ validationErrors: validationErrors.details });
            else res.status(500).send('Error updating a book.');
        });
});


//Post New Book
booksRouter.post('/', (req, res) => {

    const error = Book.validate(req.body);
    if (error) {
        res.status(422).json({ validationErrors: error.details });
    }
    else {
        Book.addingOneBook(req.body)
            .then((createdBook) => {
                res.status(201).json(createdBook);
            })
            .catch((err) => {
                res.status(500).send('Error saving the book');
            });
    }
});

//Delete a book
booksRouter.delete('/:id', (req, res) => {
    Book.destroy(req.params.id)
        .then((deleted) => {
            if (deleted) res.status(200).send('🎉 Livre suprimé avec succès!');
            else res.status(404).send('Livre non trouvé');

        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error deleting a book');
        });
});




module.exports = booksRouter;
