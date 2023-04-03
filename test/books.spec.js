//To do
//Copie vers la fiche de révision
//Trouver des choses qui pourraient provoquer erreurs et faire les test
//Faire les test pour users borrowing et auth dans des fichiers separés

// test/books.spec.js

const request = require("supertest");
const app = require("../app");

describe("Test the books path", () => {
  let server;

  beforeAll(() => {
    return new Promise((resolve) => {
      server = app.listen(3000, () => {
        console.log("Server started on port 3000");
        resolve();
      });
    });
  });

  afterAll((done) => {
    server.close(done);
  });
  //si on envoie un id correct
  //si on envoie un id pas numerique
  //si on envoie un id qui n'existe pas
  test("GET/1 sends the books with id=1 as json", async () => {
    const response = await request(app).get("/api/books/1");
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({
      bookId: 1,
      title: "Anne of Green Gables",
      author: "Lucy Maud Montgomery",
      isFree: 0,
    });
  });
  test("GET/a sends the error message", async () => {
    const response = await request(app).get("/api/books/a");
    expect(response.statusCode).toBe(422);
    expect(response.type).toMatch(/text/); // Vérifie que le type de contenu est un texte
    expect(response.text).toContain("L'id doit être un numéro");
  });
  test("GET/100 sends the error message", async () => {
    const response = await request(app).get("/api/books/100");
    expect(response.statusCode).toBe(404);
    expect(response.type).toBe("text/html");
    const expected = { error: "Livre non enregristré dans cette bibliothèque" };

    expect(response.body).toEqual(expected);
  });
  //S'il y a pas des données
  //S'ils sont pas des string
  //Si tout est correct

  test("POST / author and title missing", async (done) => {
    try {
      request(app)
        .post("/books")
        //objet à envoyer au back ici un objet vide
        .send({})
        .expect(422)
        .expect("Content-Type", "text/html")
        .then((response) => {
          const expected = {
            error: "Les données introduites ne sont pas correctes",
          };
          expect(response.body).toEqual(expected);
          done();
        });
    } catch (error) {
      console.error(error);
    }
  });
  test("POST / author and title are not a string", async (done) => {
    try {
      request(app)
        .post("/books")
        .send({ author: 56, title: [] })
        .expect(422)
        .expect("Content-Type", /json/)
        .then((response) => {
          const expected = {
            error: "Les données introduites ne sont pas correctes",
          };
          expect(response.body).toEqual(expected);
          done();
        });
    } catch (error) {
      console.error(error);
    }
  });

  test("POST / create a new book", async () => {
    try {
      request(app)
        .post("/books")
        .send({
          author: "Jest A American Boy",
          title: "Jest à votre service",
          isFree: 0,
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then((response) => {
          const expected = {
            bookId: expect.any(Number),
            author: "Jest A American Boy",
            title: "Jest à votre service",
            isFree: 0,
          };
          expect(response.body).toEqual(expected);
          done();
        });
    } catch (error) {
      console.error(error);
    }
  });

  test("DELETE /1 delete a book with id=1", async () => {
    try {
      request(app)
        .delete("/books/1")
        //objet à envoyer au back

        .send({
          id: 1,
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          expect(response.body).toEqual(expect);
          done();
        });
    } catch (error) {
      console.error(error);
    }
  });
  test("DELETE /1000 return error message", async () => {
    try {
      request(app)
        .delete("/books/1000")
        .send({
          id: 1000,
        })
        .expect(404)
        .expect("Content-Type", /json/)
        .then((response) => {
          const expected = {
            error: "Livre non enregristré dans cette bibliothèque",
          };
          expect(response.body).toEqual(expectedBody);
          done();
        });
    } catch (error) {
      console.error(error);
    }
  });
});
