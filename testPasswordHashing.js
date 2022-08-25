const User = require('./models/users');
User.hashPassword('admin').then((hashedPassword) => {

    console.log("admin: " + hashedPassword);
});
User.verifyPassword(
    'admin',
    '$argon2id$v=19$m=65536,t=5,p=1$5z3rLF8PsF6UqyQ3S2damw$drsM2X6wQcNr0J24eQmqdHx32GQhpsqlqegcZmk9pok'

    // 'myPlainPassword',
    // '$argon2id$v=19$m=65536,t=5,p=1$6F4WFjpSx9bSq9k4lp2fiQ$cjVgCHF/voka5bZI9YAainiaT+LkaQxfNN638b/h4fQ'
).then((passwordIsCorrect) => {
    console.log(passwordIsCorrect);

});

