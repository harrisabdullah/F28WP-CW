function checkPass (password, dbPassword){
    return password == dbPassword;
}



module.exports = { checkPass };
