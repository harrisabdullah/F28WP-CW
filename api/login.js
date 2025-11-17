const jwt = require('jsonwebtoken');

async function checkPass (db, password, dbPassword){
    return password == dbPassword;
}

function makeToken(user){
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

module.exports = { checkPass, makeToken };
