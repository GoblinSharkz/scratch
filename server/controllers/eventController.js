//const pool = require("./db");
const fetch = require('node-fetch');

const eventController = {};

eventController.getEvents = async function (req, res, next) {
  // write code here
  try {

    const response = await fetch("https://api.seatgeek.com/2/events/?client_id=Mjg4NTA1MzV8MTY2MjE3MTQ0My4yNzU1MjQ0&client_secret=204c2dd2dced7388da2c2fac9a21e7d4c62be152992783788b770e042221cb6f");
    const jsonData = await response.json();


    //jsonData.events[0].datetime_utc => "2022-09-02T07:30:00"
    //jsonData.events[0].type => "music_festival"
    //jsonData.events[0].venue.state => OH
    //jsonData.events[0].venue.name => "The Snow Fork Event Center"
    //jsonData.events[0].venue.timezone => "America/New_York"
    //jsonData.events[0].venue.url => "https://seatgeek.com/venues/the-snow-fork-event-center/tickets" //revisit, a few URLS available
    //jsonData.events[0].venue.location => {"lat": 39.4543, "lon": -82.1786}
    //jsonData.events[0].venue.address => "5685 Happy Hollow Road"
    //jsonData.events[0].venue.country => "US"
    //jsonData.events[0].venue.city => "Nelsonville"
    //jsonData.events[0].venue.slug => "the-snow-fork-event-center"
    //jsonData.events[0].venue.extended_address => "Nelsonville, OH 45764"
    //jsonData.events[0].venue.metro_code => 564
    //jsonData.events[0].venue.display_location => "Nelsonville, OH"
    //jsonData.events[0].performers[0].name => "Nelsonville Music Festival"

    res.locals.events = jsonData.events[1];

    return next();
  } catch (error) {
    return next({
        log: error + ': Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' }
    })
  }
};



module.exports = eventController;