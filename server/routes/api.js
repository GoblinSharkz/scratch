const express = require('express');

const eventController = require('../controllers/eventController');

const router = express.Router();

router.get('/events',
eventController.getEvents,
  (req, res) => res.status(200).json(res.locals.events)
);


//stretch challenges

// router.post('/',
//   (req, res) => res.status(200).json()
// );

// router.put('/',
//   (req, res) => res.status(200).json()
// );

// router.delete('/]',
//   (req, res) => res.status(200).json()
// );

// router.patch('/',
//   (req, res) => res.status(200).json()
// );

module.exports = router;