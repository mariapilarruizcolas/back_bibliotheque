const crypto = require("crypto");
const jwt = require("jsonwebtoken");

require('dotenv').config;



const calculateToken = (userEmail = "") => {
    return crypto
        .createHash("md5")
        .update(userEmail + PRIVATE_KEY)
        .digest("hex");
};



const calculateJWTToken = (user) => {
    const token = jwt.sign({ email: user.email, id: user.id }, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: '1y' });

    return token;
}

const decodeUserFromJWT = (token) => {
    return jwt.decode(token);
};
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, (err, user) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.user = user;

        next();
    })

}

module.exports = { calculateToken, calculateJWTToken, decodeUserFromJWT, authenticateToken };

