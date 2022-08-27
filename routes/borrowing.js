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

            res.status(500).send('Error saving the borrowing');
        });
}
    //}()
);
//Delete a borrowing
borrowingRouter.delete('/:id', (req, res) => {
    let existingBorrowing = null;
    Borrowing.getBorrowingByBookId(req.params.id)
        .then((borrowing) => {
            existingBorrowing = borrowing;
            if (!existingBorrowing) return Promise.reject('RECORD_NOT_FOUND');
            // else res.status(200).json(borrowing);
            else return Borrowing.destroy(req.params.id)
        })
        .then((deleted) => {
            if (deleted) res.status(200).send('🎉 Livre rendu avec succès!');
            else res.status(404).send('Livre non trouvé');

        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error deleting a borrowing');
        });
});

module.exports = borrowingRouter;
