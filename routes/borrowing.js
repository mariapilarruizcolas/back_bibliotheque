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
 

////////////////////
//Get Borrowing//
////////////////////

//Savoir si l'utilisateur a des emprunts dans son compte
//D'abord on cherche si l'utilisateur exist: findOneUser
//Après on cherche s'il a des emprunts: getBorrowingByUserId

//ROUTE Postman: GET: http://localhost:8000/api/borrowing/:userId
//SCHEMA de données de sortie:
// {
//   "title": "L'histoire interminable",
//   "author": "Michael Ende",
//   "deadlineDate": "2023-12-30T23:00:00.000Z",
//   "userId": 1,
//   "bookId": 3
// }

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

/////////////////
//Return Book //
////////////////
//ROUTE Postman: PUT : http://localhost:8000/api/borrowing/:bookId
//Verifier si le livre existe dans la bibliothèque: findOneBook
//Si le livre existe récuperer les données de l'emprunt: getBorrowingByBookId
//Return book: mettre isFree disponible =1
//Suprimer l'emprunt : deleteBorrowing
//Enlever le livre de la liste de l'user: returnBook

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
////////////////////
//Create Borrowing//
////////////////////
//Il valide les données d'entrée: validateBorrowing
//Il vérifie que le livre est disponible: bookIsFree
// il cree un nouveau emprunt: createOneBorrowing
//il changera isFree en 0 non disponible: borrowingBook=>isFree=0 non et 1 yes
//ROUTE Postman: POST : http://localhost:8000/api/borrowing
//SCHEMA de données:
//{  "userId": 1,=>type number
//   "bookId": 2,=>type number
//   "deadlineDate": "2023-12-31"=>type string
// }


borrowingRouter.post("/", (req, res) => {
  console.log(req.body);
  const error = Borrowing.validateBorrowing(req.body);

  if (error) {
       res.status(422).send("Erreur de validation des données");
  } else {
    Borrowing.bookIsFree(req.body)
      .then(([results]) => {
        console.log("Résultat de la requête :", results);

        if (results && results.isFree == 0) {
          res.status(404).send("Ce livre n'est pas disponible");
        } else {
          Borrowing.createOneBorrowing(req.body)
      .then((createdBorrowing) => {
        let boorrowingBookId = createdBorrowing.bookId;
        console.log("Livre numéro ", createdBorrowing.bookId);
        //On met le livre non disponible
        Borrowing.borrowingBook(boorrowingBookId).then((borrowingCreated) => {
          res.status(201).send("🎉 Livre emprunté avec succès.");
        });
        }
      )}})
      .catch((err) => {
        console.error("Une erreur s'est produite lors de la vérification de la disponibilité du livre :", err);
        res.status(500).send("Une erreur s'est produite lors de la vérification de la disponibilité du livre");
      });
  }
});

module.exports = borrowingRouter;
