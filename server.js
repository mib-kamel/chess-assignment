const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 80;

const root = path.join(__dirname, 'dist', 'chess-assignment');

app.get('*', function (req, res) {
    fs.stat(root + req.path, function (err) {
        if (err) {
            res.sendFile("index.html", { root });
        } else {
            res.sendFile(req.path, { root });
        }
    })
});

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));