async function checkPass (db, password, dbPassword){
    return password == dbPassword;
}



module.exports = { checkPass };
