const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const db = require('./dbinit')
const buildHotelSearchQuery = require('./api/buildHotelSearchQuery')

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
    console.log(req.body);
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

