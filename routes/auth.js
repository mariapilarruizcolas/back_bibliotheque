const authRouter = require("express").Router();
const User = require("../models/users");
const {
  calculateToken,
  calculateJWTToken,
  authenticateToken,
} = require("../helpers/users");

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  const error = User.validateAuth(req.body);
  if (error) {
    res.status(422).send({ validationErrors: error.details });
  } else {
    User.findByEmail(email).then((user) => {
      if (!user) res.status(401).send("Utilisateur non réconnu");
      else {
        User.verifyPassword(password, user.hashedPassword).then(
          (passwordIsCorrect) => {
            if (passwordIsCorrect) {
              console.log("password ok");
              const token = calculateJWTToken(user);
              res.status(200).json({
                token,
                user,
              });
            } else res.status(401).send("Invalid credentials");
          }
        );
      }
    });
  }
});

authRouter.get("/me", authenticateToken, (req, res) => {
  res.send(req.user);
});

module.exports = authRouter;
