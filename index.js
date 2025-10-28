const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const db = require('./dbinit')

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search', 'index.html'))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
