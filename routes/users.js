const usersRouter = require('express').Router();
const User = require('../models/users');


//Get All Users
usersRouter.get('/', (req, res) => {
    User.getAllUsers()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            res.status(500).send('Error retrieving users');
        });
});

//Get One User by UserId
usersRouter.get('/:id', (req, res) => {
    User.findOne(req.params.id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            res.status(500).send('Error retrieving user');
        })
}
);


//Create a new User
usersRouter.post('/', (req, res) => {
    const { email } = req.body;

    User.findByEmail(email)
        .then((existingUserWithEmail) => {
            if (existingUserWithEmail) return Promise.reject('DUPLICATE_EMAIL');
            return User.create(req.body);
        })

        .then((createdUser) => {
            if (createdUser) res.status(201).send('🎉 Nouveau utilisateur bien enregistré!');
            else res.status(500).send('Erreur pendant l enregistrement de l utilisateur');
        })
        .catch((err) => {
            console.error(err);
            if (err === 'DUPLICATE_EMAIL')
                res.status(409).send({ message: 'Cet email est déjà utilisé!' });
            else if (err === 'INVALID_DATA')
                res.status(422).json({ validationErrors });
            else res.status(500).send('Erreur pendant l enregistrement de l utilisateur');
        })
});


//Put a user NON used

usersRouter.put('/:id', (req, res) => {

    let existingUser = null;
    let validationErrors = null;
    Promise.all([
        User.findOne(req.params.id),
        User.findByEmailWithDifferentId(req.body.email, req.params.id),
    ])
        .then(([user, otherUserWithEmail]) => {
            existingUser = user;
            if (!existingUser) return Promise.reject('RECORD_NOT_FOUND');
            if (otherUserWithEmail) return Promise.reject('DUPLICATE_EMAIL');
            validationErrors = User.validate(req.body, false);
            if (validationErrors) return Promise.reject('INVALID_DATA');
            const token = calculateToken(email);
            return User.User.update(req.params.id, req.body, token);
        })
        .then(() => {
            res.status(200).json({ ...existingUser, ...req.body });
        })
        .catch((err) => {
            console.error(err);
            if (err === 'RECORD_NOT_FOUND')
                res.status(404).send(`User with id ${userId} not found.`);
            if (err === 'DUPLICATE_EMAIL')
                res.status(409).json({ message: 'This email is already used' });
            else if (err === 'INVALID_DATA')
                res.status(422).json({ validationErrors });
            else res.status(500).send('Error updating a user');
        });
});

//Delete a user

usersRouter.delete('/:id', (req, res) => {
    User.destroy(req.params.id)
        .then((deleted) => {
            if (deleted) res.status(200).send('🎉 Utilisateur suprimé!');
            else res.status(404).send('User not found');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error deleting a user');
        });
});


module.exports = usersRouter;
