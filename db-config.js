require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Fonction pour établir la connexion à la base de données
function connect() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Erreur lors de la connexion à la base de données: ", err);
      throw err;
    }
    console.log("Connecté à la base de données MySQL.");
  });
}

// Fonction pour fermer la connexion à la base de données
function disconnect() {
  pool.end((err) => {
    if (err) {
      console.error(
        "Erreur lors de la fermeture de la connexion à la base de données: ",
        err
      );
      throw err;
    }
    console.log("Déconnecté de la base de données MySQL.");
  });
}

// Exporter la connexion et les fonctions de connexion et de déconnexion
module.exports = {
  pool,
  connect,
  disconnect,
};
