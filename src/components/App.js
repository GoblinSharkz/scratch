import * as React from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import fetch from 'node-fetch';

// import * as React from 'react';

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, Fragment, useEffect} from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';

export default function App() {
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [zipCode, setzipCode] = useState('');
  const [APIresults, setAPIresults] = useState({});

  //useEffect(() => {
      // console.log('used effect');
      // ResultsTable(APIresults);
   // }, []);
   async function getEvents(startDate, endDate, zipCode) {
    /*
    Events in April 2012
    $ curl 'https://api.seatgeek.com/2/events?datetime_utc.gte=2012-04-01&datetime_utc.lte=2012-04-30'
    */
      zipCode = zipCode.replace(' ', '+');
      // console.log("startDate: " + startDate)
      let startFormatDate = new Date(startDate);
      let endFormatDate = new Date(endDate);
      startFormatDate = startFormatDate.toISOString().split('T')[0];
      endFormatDate = endFormatDate.toISOString().split('T')[0];
      
      console.log("Start date " + startFormatDate);
      console.log("end date:", endFormatDate);
      console.log("ZIP code: " + zipCode);
      
      const response = await fetch(`https://api.seatgeek.com/2/events/?client_id=Mjg4NTA1MzV8MTY2MjE3MTQ0My4yNzU1MjQ0&client_secret=204c2dd2dced7388da2c2fac9a21e7d4c62be152992783788b770e042221cb6f&q=${zipCode}&datetime_utc.gte=${startFormatDate}&datetime_utc.lte=${endFormatDate}`);
      const jsonData = await response.json();

    //  const covidResponse = await fetch(`https://api.covidactnow.org/v2/state/NY.json?apiKey=d7c7e47e103b479e936e33786387b5aa`);
    //  const covidJsonData = await response.json();
    
    //  console.log(covidJsonData);
    
      //setAPIresults(jsonData);
      console.log('JSON data: ', jsonData);
      setAPIresults(jsonData)
      //return jsonData;
      // console.log(jsonData.events[0].datetime_utc);
    }
  return (
      <Fragment>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 0, width: '58ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField onChange={(newValue) => {
            setzipCode(newValue.target.value);
          }} id="outlined-basic" label="City" variant="outlined" />
        </Box>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Start Date"
        value={startValue}
        onChange={(newValue) => {
          setStartValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
            <DatePicker
        label="End Date"
        value={endValue}
        onChange={(newValue) => {
          setEndValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
        <Button startIcon={<SearchIcon />}
    onClick={() => getEvents(startValue, endValue, zipCode)} variant="contained">Search</Button>
    </LocalizationProvider>
        <ResultsTable results={APIresults}/>
    </Fragment>
  );
}


//jsonData.events[0].datetime_utc => "2022-09-02T07:30:00" ISO DATE
//we have Full string date formate 22 Sep 2022

function ResultsTable(props) {
  // if(props) props.then(data => console.log(data));
  //whenever the state changes, we re-render the ResultsTable
  //props.results.events
    // console.log("props: ", props);
// console.log()
    // console.log("props: ", props.results.events);
    if (props.results.hasOwnProperty('events')) {
      //console.log(props.results.events[0])
      function createData(name, type, venueName, venueLocation, dateTime, url) {
        return { name, type, venueName, venueLocation, dateTime, url };
      }
    
    const rows = [
      //createData('New York Rangers', 'sports', 'Madison Square Garden', '34th street', '2022-01-10', 'Buytickets'),
    ];
    //loop through props.results.events
    for (let i = 0; i < props.results.events.length; i++){
      let events = props.results.events;
      rows.push(createData(
        props.results.events[i].title, 
        props.results.events[i].type, 
        props.results.events[i].venue.name, 
        props.results.events[i].venue.display_location, 
        props.results.events[i].datetime_utc, 
        props.results.events[i].url))
    }
    //grab all the fields we care about
    //push to rows, the call to createData with the data of that event 
    
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Venue Name</TableCell>
                <TableCell align="right">Venue Location</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.venueName}</TableCell>
                  <TableCell align="right">{row.venueLocation}</TableCell>
                  <TableCell align="right">{row.dateTime.split('T')[0]}</TableCell>
                  <TableCell align="right"><a href={row.url}>Buy Tickets</a></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
      //do nothing
      //time to render the table because we have events now
    } else {
      return '';
    }

   
  
}
   //date
    //jsonData.events[0].type => "music_festival"
    //jsonData.events[0].venue.name => "The Snow Fork Event Center"
    //jsonData.events[0].venue.display_location => "Nelsonville, OH"
    //jsonData.events[0].performers[0].name => "Nelsonville Music Festival"
    //jsonData.events[0].venue.url => tickkets url





    // stretch goal: get covid cases in that state
    //docs: https://apidocs.covidactnow.org/api/#tag/State-Data/paths/~1state~1{state}.json?apiKey={apiKey}/get
    //API: https://api.covidactnow.org/v2/state/NY.json?apiKey=d7c7e47e103b479e936e33786387b5aa

    // const response = await fetch(`https://api.covidactnow.org/v2/state/NY.json?apiKey=d7c7e47e103b479e936e33786387b5aa');
    // const jsonData = await response.json();
    //above is a request for NY
    //interesting fields:
    // "weeklyNewCasesPer100k": 152.0

    //covid data by county
    //https://apidocs.covidactnow.org/api#tag/County-Data
    //https://api.covidactnow.org/v2/county/{fips}.json?apiKey={apiKey}
    //fips = 5 Letter County FIPS code