const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const { dbinit, rowExists } = require('./dbUtils')
const buildHotelSearchQuery = require('./api/buildHotelSearchQuery')
const buildMakeBookingQuery = require('./api/buildMakeBookingQuery')
const buildCancelBookingQuery = require('./api/buildCancelBookingQuery')
const buildGetterQuery = require('./api/buildGetterQuery')

db = dbinit();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// pages

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search', 'search.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'))
})

app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign-up', 'signup.html'))
})

app.get('/bookings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bookings', 'bookings.html'))
})

app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error', 'error.html'))
})

app.get('/hotels/:hotelId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hotel-template', 'hotel-template.html'))
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

app.post('/api/make_booking', async (req, res) => {
    const query = buildMakeBookingQuery(req.body);
    if (query == -1){
        res.status(400).json({ error: 'Invalid request' });
        return;
    }
    if (!(await rowExists(db, 'Users', 'userID', req.body.userID))){
        res.status(400).json({ error: 'User not found' });
        return;
    }
    if (!(await rowExists(db, 'Hotels', 'hotelID', req.body.hotelID))){
        res.status(400).json({ error: 'Hotel not found' });
        return;
    }

    db.run(query[0], query[1], function(err) {
        if (err){
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ bookingID: this.lastID });
    });
})

app.post('/api/cancel_booking', async (req, res) => {
    const query = buildCancelBookingQuery(req.body);
    if (query == -1){
        res.status(400).json({ error: 'Invalid request' });
        return;
    }
    db.get('SELECT * FROM Bookings WHERE bookingID = ?', [req.body.bookingID], (err, row) => {
    if (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database error' });
        return;
    }
    if (row) {
        if (row.user != req.body.userID){
        res.status(400).json({ error: 'Permission denied' });
        return;
        }
    } else {
        res.status(400).json({ error: 'Booking not found' });
        return;
    }
    });

    db.run(query[0], query[1], (err) => {
        if (err){
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.status(200).json({ message: 'Booking canceled successfully' });
    })
})

app.get('/api/get_bookings', (req, res) => {
    const query = buildGetterQuery(req.body, 'Bookings', 'user');
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

app.get('/api/get_hotel', (req, res) => {
    const query = buildGetterQuery(req.body, 'Hotels', 'hotelID');
    if (query == -1){
        res.status(400).json({ error: 'Invalid request' });
        return;
    }
    db.get(query[0], query[1], (err, row) => {
        if (err){
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (row){
            res.json(row);
            return;
        }
        res.status(400).json({ error: 'Hotel not found' });
    })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
