const usersRouter = require("express").Router();
const User = require("../models/users");
const Borrowing = require("../models/borrowing");

//Exemple de requete en Postman localhost:8000/api/users

//Get All Users
usersRouter.get("/", (req, res) => {
  User.getAllUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).send("Erreur pour retrouver l'utilisateur");
    });
});

//Get One User by UserId
usersRouter.get("/:id", (req, res) => {
  User.findOneUser(req.params.id)
    .then((user) => {
      if (user.length === 0) {
        res.status(404).send("Utilisateur non trouvé");
        return;
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).send("Utilisateur non trouvé");
    });
});

//Create a new User
//D'abord il verifie si l'email est deja utilise
//Apres il valide les donnees et si tout va bien
//Il inscrit un nouveau user dans la bdd
//Route sur postman: post("http://localhost:8000/api/users"
usersRouter.post("/", (req, res) => {
  const { email } = req.body;
  let validationErrors = null;

  User.findByEmail(email)
    .then((existingUserWithEmail) => {
      if (existingUserWithEmail) return Promise.reject("DUPLICATE_EMAIL");
      validationErrors = User.validateUser(req.body);
      if (validationErrors) return Promise.reject("INVALID_DATA");
      return User.createUser(req.body);
    })

    .then((createdUser) => {
      if (createdUser)
        res.status(201).send("🎉 Nouveau utilisateur bien enregistré!");
      else
        res
          .status(500)
          .send("Erreur pendant l'enregistrement de l'utilisateur");
    })
    .catch((err) => {
      console.error(err);
      console.log(res.data);
      if (err === "DUPLICATE_EMAIL")
        res.status(409).send("Cet email est déjà utilisé!");
      else if (err === "INVALID_DATA")
        res.status(422).send("Tous les données sont necessaires");
      else
        res
          .status(500)
          .send("Erreur pendant l'enregistrement de l'utilisateur");
    });
});

//Put a user CREER UN TOKEN
//PAS COMPRIS A QUOI ÇA SERT
//A REFAIRE EN PLUS SIMPLE POUR CHANGER LES DONNEES D'UN USER

usersRouter.put("/:id", (req, res) => {
  let existingUser = null;
  let validationErrors = null;
  Promise.all([
    User.findOneUser(req.params.id),
    User.findByEmailWithDifferentId(req.body.email, req.params.id),
  ])

    .then(([user, otherUserWithEmail]) => {
      existingUser = user;
      if (!existingUser) return Promise.reject("RECORD_NOT_FOUND");
      if (otherUserWithEmail) return Promise.reject("DUPLICATE_EMAIL");
      validationErrors = User.validate(req.body, false);
      if (validationErrors) return Promise.reject("INVALID_DATA");
      const token = calculateToken(email);
      return User.User.update(req.params.id, req.body, token);
    })
    .then(() => {
      res.status(200).json({ ...existingUser, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === "RECORD_NOT_FOUND")
        res.status(404).send(`User with id ${userId} not found.`);
      if (err === "DUPLICATE_EMAIL")
        res.status(409).json({ message: "Cet email est déjà utilisé" });
      else if (err === "INVALID_DATA")
        res.status(422).json({ validationErrors });
      else res.status(500).send("Erreur en mettant à jour un utilisateur");
    });
});

//Delete a user
//Il cherche d'abord si l'utilisateur existe
//Apres s'il a des emprunts
//S'il en a pas il supprime

usersRouter.delete("/:id", (req, res) => {
  User.findOneUser(req.params.id).then((user) => {
    if (!user) {
      res
        .status(404)
        .send("Utilisateur non enregristré dans cette bibliothèque");
    }
    Borrowing.getBorrowingByUserId(req.params.id)
      .then((borrowing) => {
        if (borrowing.length === 0) {
          User.destroyUser(req.params.id)
            .then((deleted) => {
              if (deleted)
                res.status(200).send("🎉 Utilisateur suprimé avec succès!");
              else res.status(404).send("Utilisateur non trouvé");
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send("Erreur pour supprimer un utilisateur");
            });
        } else {
          res
            .status(403)
            .send(
              "L'utilisateur a des emprunts en cours et ne peut pas être supprimé"
            );
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Erreur pendant la suppression d'un utilisateur");
      });
  });
});

module.exports = usersRouter;
