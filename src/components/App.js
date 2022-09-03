import * as React from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { DateRangePicker } from '@material-ui/pickers'


function App() {
  return <Button startIcon={<SearchIcon />}
  onClick={() => console.log('clicked')} variant="contained">Search</Button>;
}



export default App;
