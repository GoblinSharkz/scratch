//const pool = require("./db");

const eventController = {};

eventController.getEvents = (req, res, next) => {
  // write code here
  try {
    res.locals.hello = 'hello';
    return next();
  } catch (error) {
    return next({
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' }
    })
  }
};



module.exports = eventController;