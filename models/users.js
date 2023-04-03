const Joi = require("joi");
const argon2 = require("argon2");

const connection = require("../db-config");
const db = connection.promise();

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOptions);
};

const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

const validateUser = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    firstname: Joi.string().max(255).presence(presence),
    lastname: Joi.string().max(255).presence(presence),
    email: Joi.string().email().max(255).presence(presence),
    admin: Joi.string().max(25).presence(presence),
    password: Joi.string().max(8).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};
const validateAuth = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    email: Joi.string().email().max(255).presence(presence),
    password: Joi.string().max(8).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const getAllUsers = () => {
  return db.query("SELECT * FROM users");
};
const findOneUser = (id) => {
  return db
    .query("SELECT * FROM users WHERE userId = ?", [id])
    .then(([results]) => {
      if (results.length === 0) {
        return [];
      }
      return results[0];
    });
};

const findByEmail = (email) => {
  return db
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([results]) => results[0]);
};

const createUser = ({ firstname, lastname, email, admin, password }) => {
  return hashPassword(password).then((hashedPassword) => {
    return db
      .query("INSERT INTO users SET ?", {
        firstname,
        lastname,
        email,
        admin,
        hashedPassword,
      })
      .then(([result]) => {
        const userId = result.insertId;
        return { userId, firstname, lastname, email, admin };
      });
  });
};

const findByEmailWithDifferentId = (email, id) => {
  return db
    .query("SELECT * FROM users WHERE email = ? AND userId <> ?", [email, id])
    .then(([results]) => results[0]);
};

const update = (id, newAttributes) => {
  return db.query("UPDATE users SET ? WHERE userId = ?", [newAttributes, id]);
};
const updatePassword = (id, newPassword) => {
  return db.query("UPDATE users SET ? WHERE userId = ?", [newPassword, id]);
};

const destroyUser = (id) => {
  return db
    .query("DELETE FROM users WHERE userId = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  validateUser,
  validateAuth,
  getAllUsers,
  findOneUser,
  createUser,
  update,
  destroyUser,
  findByEmail,
  findByEmailWithDifferentId,
  hashPassword,
  verifyPassword,
  updatePassword,
};
