const jwt = require('jsonwebtoken');


function checkUser(db, username, callback){
    const query = 'SELECT * FROM Users WHERE username = ?'
    db.get(query, [username], callback);
}

function addUser(db, username, password, callback){
    const query = 'INSERT INTO Users (username, password) VALUES (?, ?)'
    db.run(query, [username, password], callback);
}

module.exports = { checkUser, addUser }