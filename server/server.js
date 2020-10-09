// Budget API
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

let budget = {}

fs.readFile('./dataset.json', 'utf-8', (err, data) => {
    if (err) throw err
    budget = JSON.parse(data)
})

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});