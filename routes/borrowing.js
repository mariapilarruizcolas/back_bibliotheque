const borrowingRouter = require('express').Router();
const Borrowing = require('../models/borrowing');

//Get Borrowing by UserId
borrowingRouter.get('/:id', (req, res) => {
    Borrowing.getBorrowingByUserId(req.params.id)
        .then((borrowing) => {
            res.status(200).json(borrowing);
        })
        .catch((err) => {
            res.status(500).send('Error retrieving borrowing');
        });
});

//Return Book
borrowingRouter.put('/:id', (req, res) => {
    let existingBorrowing = null;
    Borrowing.getBorrowingByBookId(req.params.id)
        .then((borrowing) => {
            existingBorrowing = borrowing;
            if (!existingBorrowing) return Promise.reject('RECORD_NOT_FOUND');
            // validationErrors = Borrowing.validate(req.body, false);
            // if (validationErrors) return Promise.reject('INVALID_DATA');
            return Borrowing.returnBook(req.body, req.params.id);
        })
        .then(() => {
            res.status(200).json({ ...existingBorrowing, ...req.body });
        })

        .catch((err) => {
            console.error(err);
            if (err === 'RECORD_NOT_FOUND')
                res.status(404).send(`Borrowing with id ${req.params.id} not found.`);
            else if (err === 'INVALID_DATA')
                res.status(422).json({ validationErrors: validationErrors.details });
            else res.status(500).send('Error updating a borrowing.');
        });
});



//Create Borrowing
borrowingRouter.post('/', (req, res) => {
    //const error = Borrowing.validate(req.body);
    //if (error) {
    //     res.status(422).json({ validationErrors: error.details });
    // } else {
    Borrowing.createOneBorrowing(req.body)
        .then((createdBorrowing) => {
            res.status(201).json(createdBorrowing);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error saving the borrowing');
        });
}
    //}
);

module.exports = borrowingRouter;
