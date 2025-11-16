const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user to the database. It records username, email, and password.
 * The passwords are hashed using bycrypt before storing them.
 * @param {Object} req - The request object containing username, email, and password.
 * @param {Obejct} res  - The response object.
 * @returns A message saying whether the registration worked or not.
 */
exports.signup = (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const checkUser = 'SELECT * FROM users WHERE email = ?';
    if(checkUser)
        return res.status(409).json({ message: 'User already exists.' });

    const hashedPassword = hashPassword(password);

    const insertUser = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    insertUser.run(email, username, hashedPassword);
    return res.status(201).json({ message: 'User registered successfully.' });
};

/**
 * Searches the database for the user and checks if the password is correct. 
 * Then it genereates a JWT token for the user and logs them into the website. 
 * @param {Object} req - The request object containing username and password.
 * @param {Object} res - The response object.
 * @returns A message whether the login worked or not and the JWT token.
 */
exports.login = (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    if(!username) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const checkPW = bcrypt.compareSync(password, user.password);
    if(!checkPW) {
        return res.status(401).json({ message: 'Invalid password.' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'Login successful.', token });
};
