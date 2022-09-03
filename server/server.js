const express = require('express');
const app = express();
const cors = require("cors");
const path = require('path');
const apiRouter = require('./routes/api');

const PORT = 3000;


//middleware
app.use(cors());
app.use(express.json()); //allows access to req.body

app.use('/build', express.static(path.join(__dirname, '../build')));

//static file on '/'
app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });


//router
app.use('/', apiRouter);


//catch all
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));


//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


/**
 * start server
 */
 app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;