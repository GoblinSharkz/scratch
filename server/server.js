const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require('path');


//middleware
app.use(cors());
app.use(express.json()); //allows access to req.body

app.use('/build', express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });


app.listen(3000, () => {
    console.log("server has started on port 3000");
});