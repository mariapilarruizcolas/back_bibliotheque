const booksRouter = require("express").Router();
const Book = require("../models/books");

//Obtenir tous les livres enregistrés dans la bibliothèque
booksRouter.get("/", (req, res) => {
  Book.getAllBooks()
    .then((books) => {
      if (books.length === 0) {
        res
          .status(404)
          .send("Pas de livres enregristrés dans cette bibliothèque");
      } else {
        res.status(200).json(books);
      }
    })
    .catch((err) => {
      res.status(500).send("Error retrieving books");
    });
});

//Obtenir un livre de la bibliothèque par bookId
booksRouter.get("/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(422).send("L'id doit être un numéro");
    return;
  }
  const bookId = parseInt(req.params.id);
  Book.findOneBook(bookId)
    .then((book) => {
      if (book.length === 0) {
        res.status(404).send("Livre non enregristré dans cette bibliothèque");
        return;
      }
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving book");
    });
});

//Créer un nouveau livre
//On vérifie les données et on l'ajoute à la base de données
booksRouter.post("/", (req, res) => {
  const error = Book.validateBook(req.body);
  if (error) {
    res.status(422).send("Les données introduites ne sont pas correctes");
  } else {
    Book.addingOneBook(req.body)
      .then((createdBook) => {
        res.status(201).json(createdBook);
      })
      .catch((err) => {
        res.status(500).send("Error saving the book");
      });
  }
});

//Supprimer un livre
//Il vérifie si le livre existe et s'il n'est pas emprunté et
//après il le supprime de la base de données
booksRouter.delete("/:id", (req, res) => {
  Book.findOneBook(req.params.id)
    .then((book) => {
      console.log("livre trouve agargur?", book);
      if (book.length === 0) {
        res.status(404).send("Livre non enregristré dans cette bibliothèque");
        console.log("livre non trouve");
        return;
      }

      if (book.isFree === 1) {
        console.log("livre libre trouve");
        //res.status(200).json(book);
        Book.destroyBook(req.params.id)
          .then((deleted) => {
            if (deleted) res.status(200).send("🎉 Livre suprimé avec succès!");
            else res.status(404).send("Livre non trouvé");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("Erreur pour supprimer un utilisateur");
          });
      } else {
        res
          .status(403)
          .send("Le livre est emprunté et il ne peut pas être supprimé");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting a book");
    });
});

module.exports = booksRouter;
