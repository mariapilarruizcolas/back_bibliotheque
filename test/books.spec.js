//To do
//INCLURE truncate books avant chaque test: il donne erreur
//Faire les test pour users borrowing et auth dans des fichiers separés

// test/books.spec.js

const request = require("supertest");
const app = require("../app");
const server = require("../server");
const { pool, connect, disconnect } = require("../db-config");

describe("Test the books path", () => {
  // Avant l'exécution des tests
  beforeAll(() => {
    connect();
  });

  // Après l'exécution des tests
  afterAll(() => {
    disconnect();
  });
  //TO DO
  //ÇA MARCHE PAS
  //Avec done on le demande de attendre que books
  // soit nettoye avant de continuer
  //beforeEach((done) => pool.query("TRUNCATE books", done));

  test("POST / create a new book", async () => {
    const response = await request(app).post("/api/books").send({
      author: "Jest A American Boy",
      title: "Jest à votre service",
      isFree: true,
    });
    expect(response.statusCode).toBe(201);
    expect(response.type).toMatch("application/json"); // Vérifie que le type de contenu est un texte
    expect(response.body).toMatchObject({
      bookId: expect.any(Number),
      author: "Jest A American Boy",
      title: "Jest à votre service",
      //isFree: expect.any(Boolean),
    });
    //expect(response.body.isFree).toBeBoolean();
    expect(response.body.isFree).toBe(true);
  });

  test("GET/1 sends the books with id=1 as json", async () => {
    const response = await request(app).get("/api/books/1");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toMatchObject({
      bookId: 1,
      author: "Jest A American Boy",
      title: "Jest à votre service",
      //isFree: expect.any(Boolean),
    });
    // expect([0, 1]).toContain(response.body.isFree);
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
    expect(response.type).toMatch(/text/); // Vérifie que le type de contenu est un texte
    expect(response.text).toContain(
      "Livre non enregristré dans cette bibliothèque"
    );
  });
  //S'il y a pas des données
  //S'ils sont pas des string
  //Si tout est correct
  test("POST / author and title missing", async () => {
    const response = await request(app).post("/api/books").send({});
    expect(response.statusCode).toBe(422);
    expect(response.type).toMatch(/text/); // Vérifie que le type de contenu est un texte
    expect(response.text).toContain(
      "Les données introduites ne sont pas correctes"
    );
  });
  test("POST / author and title are not a string", async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ author: 56, title: [] });
    expect(response.statusCode).toBe(422);
    expect(response.type).toMatch(/text/); // Vérifie que le type de contenu est un texte
    expect(response.text).toContain(
      "Les données introduites ne sont pas correctes"
    );
  });

  test("DELETE /1 delete a book with id=1", async () => {
    const response = await request(app).delete("/api/books/1");
    expect(response.statusCode).toBe(200);
    expect(response.type).toMatch(/text/); // Vérifie que le type de contenu est un texte
    expect(response.text).toContain("🎉 Livre suprimé avec succès!");
  });
  //on cree un livre emprunte et on essaie de le supprimer
  test("POST / create a new book", async () => {
    const response = await request(app).post("/api/books").send({
      author: "Moi meme",
      title: "La bibliotheque des rêves bleus",
      isFree: false,
    });
    expect(response.statusCode).toBe(201);
    expect(response.type).toMatch("application/json");
    expect(response.body).toMatchObject({
      bookId: expect.any(Number),
      author: "Moi meme",
      title: "La bibliotheque des rêves bleus",
    });
    expect(response.body.isFree).toBe(false);
  });
  test("DELETE /2 delete a book with id=2", async () => {
    const response = await request(app).delete("/api/books/2");
    expect(response.statusCode).toBe(403);
    expect(response.type).toMatch(/text/);
    expect(response.text).toContain(
      "Le livre est emprunté et il ne peut pas être supprimé"
    );
  });
  test("DELETE /1000 return error message", async () => {
    const response = await request(app).delete("/api/books/1000");
    expect(response.statusCode).toBe(404);
    expect(response.type).toMatch(/text/);
    expect(response.text).toContain(
      "Livre non enregristré dans cette bibliothèque"
    );
  });
});
