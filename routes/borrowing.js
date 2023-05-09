const borrowingRouter = require("express").Router();
const Borrowing = require("../models/borrowing");
const User = require("../models/users");
const Book = require("../models/books");

//TO DO UN JOUR
//Test GET userID
//Si c'est pas un numero ou null
//Si l'utilisateur existe pas
//Si l'utilisateur a pas d'emprunts
//Si l'utilisateur a de plusieurs emprunts

//ROUTE  GET userID==> savoir si un user a des emprunts
//Si l'utilisateur existe on regarde

//ROUTE  PUT bookID==>//rendre un livre
//Si le book existe et il est dans la liste d'emprunts
//On modifie la table books isFree= yes
//On supprime l'emprunt
//ROUTE  POST bookID==>emprunter un livre
//Si le book existe et l'user existe
//On modifie la table books isFree= non
//On cree la date de retour
//On cree l'emprunt sur la table emprunts

//Savoir si l'utilisateur a des emprunts dans son compte
//D'abord on cherche si l'utilisateur exist
borrowingRouter.get("/:id", (req, res) => {
  User.findOneUser(req.params.id).then((userExists) => {
    if (userExists.length === 0) {
      res.status(404).send("Utilisateur non trouvé");
      return;
    }
    Borrowing.getBorrowingByUserId(userExists.userId)
      .then((borrowings) => {
        if (borrowings.length === 0) {
          res.status(404).send("Cet utilisateur n'a pas emprunté de livres");
          return;
        }
        res.status(200).json(borrowings);
      })
      .catch((err) => {
        res.status(500).send("Erreur pour retrouver des emprunts");
      });
  });
});

//Return Book
//Verifier si le livre existe dans la bibliothèque
//findOneBook
//Si le livre existe récuperer les données de l'emprunt
//getBorrowingByBookId
//Return book: mettre isFree disponible
//Suprimer l'emprunt
//deleteBorrowing
//Enlever le livre de la liste de l'user

borrowingRouter.put("/:bookId", (req, res) => {
  // On cherche si le livre existe
  Book.findOneBook(req.params.bookId).then((bookExists) => {
    if (bookExists.length === 0) {
      res.status(404).send("Livre non enregristré dans cette bibliothèque");
      return;
    }
    console.log("Le livre existe? ", bookExists);
    Borrowing.getBorrowingByBookId(req.params.bookId)
      .then((borrowings) => {
        if (borrowings.length === 0) {
          res.status(404).send("Livre n'est pas emprunté actuellement");
        } else {
          console.log("les données de l'emprunt ", borrowings);
          Borrowing.deleteBorrowing(req.params.bookId).then(() => {
            Borrowing.returnBook(req.params.bookId).then((isFree) => {
              console.log("Le livre est libre? ", isFree);
              res.status(200).send("🎉 Livre rendu avec succès");
            });
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Erreur dans le retour du livre");
      });
  });
});

//Create Borrowing
//Il valide les données d'entrée,
// il cree un nouveau emprunt
//il changera isFree en non

borrowingRouter.post("/", (req, res) => {
  console.log(req.body);
  const error = Borrowing.validateBorrowing(req.body);
  if (error) {
    res.status(422).send("Erreur de validation des données");
  } else {
    Borrowing.createOneBorrowing(req.body)
      .then((createdBorrowing) => {
        let boorrowingBookId = createdBorrowing.bookId;
        console.log("Livre numéro ", createdBorrowing.bookId);
        //On met le livre non disponible
        Borrowing.borrowingBook(boorrowingBookId).then((borrowingCreated) => {
          res.status(201).send("🎉 Livre emprunté avec succès.");
        });
      })
      .catch((err) => {
        res.status(500).send("Emprunt impossible");
      });
  }
});

module.exports = borrowingRouter;
