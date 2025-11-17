const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const { dbinit } = require('./dbUtils')
const buildHotelSearchQuery = require('./api/buildHotelSearchQuery')
const loginUtil = require('./api/login')
const signupUtil = require('./api/signup')

db = dbinit();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// pages

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search', 'index.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'index.html'))
})

app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign-up', 'index.html'))
})

app.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bookings', 'index.html'))
})

app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error', 'index.html'))
})

app.get('/hotels/:hotelId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hotel-template', 'index.html'))
})

// APIs

app.post('/api/search', (req, res) => {
    const query = buildHotelSearchQuery(req.body);
    if (query == -1){
        res.status(400).json({ error: 'Invalid request' });
        return;
    }
    db.all(query[0], query[1], (err, rows) => {
        if (err){
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(rows);
    })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const query = 'SELECT * FROM Users WHERE username = ?'

    db.get(query, [username], async (err, user) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error. '})
        }

        if(!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    const checkPW = loginUtil.checkPass(db, password, user.password);
        if(!checkPW) {
            return res.status(401).json({ message: 'Invalid password.' });
    }
    
    return res.status(200).json({ message: 'Login successful.', userID: user.userID });
    })
})

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    signupUtil.checkUser(db, username, async (err, user) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error. '});
        }

        if(user) {
        return res.status(409).json({ error: 'User already exists.' });
        }
        
        
        signupUtil.addUser(db, username, password, function(err) {
            if(err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error. '})
                }  
            return res.status(201).json({ message: 'User registered successfully.' , userID: this.lastID});
        })
        
    })
})
