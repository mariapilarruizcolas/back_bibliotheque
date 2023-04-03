const booksRouter = require("express").Router();
const Book = require("../models/books");
//Routes vérifiés OK ÇA MARCHE

//Get all books MARCHE
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

//Get by BookId MARCHE
booksRouter.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(422).send("L'id doit être un numéro");
    return;
  }

  Book.findOneBook(req.params.id)
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

//Post New Book MARCHE
//On met title, autor et isFree="true";
booksRouter.post("/", (req, res) => {
  const error = Book.validateBook(req.body);
  if (error) {
    res
      .status(422)
      .send({ error: "Les données introduites ne sont pas correctes" });
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

//Delete a book MARCHE
//AJOUTER QUE TU PEUX PAS SUPPRIMER S'IL EST PAS FREE
booksRouter.delete("/:id", (req, res) => {
  Book.findOneBook(req.params.id).then((book) => {
    if (book.length === 0) {
      res.status(404).send("Livre non enregristré dans cette bibliothèque");
      return;
    }
    if (book.isFree === 1) {
      res.status(200).json(book);
      Book.destroyBook(req.params.id)
        .then((deleted) => {
          if (deleted) res.status(200).send("🎉 Livre suprimé avec succès!");
          else res.status(404).send("Livre non trouvé");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Error deleting a book");
        });
    } else {
      res
        .status(500)
        .send("Le livre est emrpunté et il ne peut pas être supprimé");
    }
  });
});

module.exports = booksRouter;
