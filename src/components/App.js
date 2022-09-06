import * as React from 'react';
import { useState, Fragment} from 'react';
//MUI imports for containers (search bar, date boxes, calendar) and result table (rendering results)
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import HelpIcon from '@mui/icons-material/Help';

export default function App() {
  const today = new Date();
  //React hooks 
  const [startValue, setStartValue] = useState(today);
  const [endValue, setEndValue] = useState('');
  const [searchString, setsearchString] = useState('');
  //API results for seatgeek API
  const [APIresults, setAPIresults] = useState({});
  //risk level for Covid API for each venue location states
  const [riskLevel, setRiskLevel] = useState({});

  async function getEvents(startDate, endDate, searchString) {
    //jsonData.events[0].datetime_utc => "2022-09-02T07:30:00" ISO DATE
    //we have Full string date formate 22 Sep 2022
    //convert the dates to the format we want
      searchString = searchString.replace(' ', '+');
      let startFormatDate = new Date(startDate);
      let endFormatDate = new Date(endDate);
      startFormatDate = startFormatDate.toISOString().split('T')[0];
      endFormatDate = endFormatDate.toISOString().split('T')[0];
      
      console.log("Start date " + startFormatDate);
      console.log("end date:", endFormatDate);
      console.log("searchString: " + searchString);
      
      const response = await fetch(`https://api.seatgeek.com/2/events/?client_id=Mjg4NTA1MzV8MTY2MjE3MTQ0My4yNzU1MjQ0&client_secret=204c2dd2dced7388da2c2fac9a21e7d4c62be152992783788b770e042221cb6f&q=${searchString}&datetime_utc.gte=${startFormatDate}&datetime_utc.lte=${endFormatDate}`);
      const jsonData = await response.json();
      // console.log('seatgeek response:', jsonData)
      //loop through the events, add each venue state to state object
      const state = {};
      for(let i = 0; i < jsonData.events.length; i++) {
        state[jsonData.events[i].venue.state] = true;
        console.log(jsonData.events[i].venue.state);
      }
      //riskLevels object for covid levels
     const riskLevels = {
        0: "Low", 1: "Medium", 2: "High"
     }
     //Pull covid risk level for each state key
     for(let key in state){
      const covidResponse = await fetch(`https://api.covidactnow.org/v2/state/${key}.json?apiKey=d7c7e47e103b479e936e33786387b5aa`);
      const covidJsonData = await covidResponse.json();
      state[key] = riskLevels[covidJsonData.communityLevels.canCommunityLevel];
    }
    /*
      state = { 
        NY: Moderate
        MA: Low
      }
    */
      setRiskLevel(state)
      setAPIresults(jsonData)
    }
  return (
    <Fragment>
      <div style={{display:"flex"}}>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 0, width: '58ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField onChange={(newValue) => {
            setsearchString(newValue.target.value);
          }} id="outlined-basic" label="Search by team, artist, event or venue" variant="outlined" />
        </Box>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Start Date"
        value={startValue}
        onChange={(newValue) => {
          setStartValue(newValue);
          console.log(newValue);
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
    onClick={() => getEvents(startValue, endValue, searchString)} variant="contained">Search</Button>
    </LocalizationProvider>
    </div>
    <div>
      <ResultsTable 
      results={APIresults}
      riskLevel={riskLevel}
      />
    </div>
    </Fragment>
  );
}

//Function creates HTML ResultsTable in app listing 10 event results
function ResultsTable(props) {
    if (props.results.hasOwnProperty('events')) {
      function createData(name, type, venueName, venueLocation, dateTime, url, riskLevel) {
        return { name, type, venueName, venueLocation, dateTime, url, riskLevel };
      }
    const rows = [];
    //loop through props.results.events
    for (let i = 0; i < props.results.events.length; i++){
      let events = props.results.events;
      rows.push(createData(
        props.results.events[i].title, 
        props.results.events[i].type, 
        props.results.events[i].venue.name, 
        props.results.events[i].venue.display_location, 
        props.results.events[i].datetime_utc, 
        props.results.events[i].url,
        props.riskLevel[props.results.events[i].venue.state]
      ))
    }
    //grab all the fields we care about
    //push to rows, then call to createData with the data of that event 
    
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx ={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx ={{ fontWeight: 'bold' }} align="right">Type</TableCell>
                <TableCell sx ={{ fontWeight: 'bold' }} align="right">Venue Name</TableCell>
                <TableCell sx ={{ fontWeight: 'bold' }} align="right">Venue Location</TableCell>
                <TableCell sx ={{ fontWeight: 'bold' }} align="right">Date</TableCell>
                <TableCell sx ={{ fontWeight: 'bold' }} align="right">URL</TableCell>
                <TableCell sx ={{ fontWeight: 'bold' }} align="right">Covid Risk Level<a target="_blank" href="https://covidactnow.org/covid-community-level-metrics"><HelpIcon></HelpIcon></a></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={row.name + index}
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
                  <TableCell align="right">{row.riskLevel}</TableCell>
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