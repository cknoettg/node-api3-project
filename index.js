// code away!
const server = require('./server.js');
// const express = require('express')

// const server = express();

// server.use(express.json());

// server.get(`/`, (req, res) => {
//     res.send({ message: `Server up and running` })
// })

server.listen(5000, () => {
  console.log('\n* Server Running on http://localhost:5000 *\n');
});