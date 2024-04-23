import { Map } from './Map';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography } from '@mui/material';

const style = {
  backgroundColor: 'white',
  minHeight: '100vh',
};

function App() {

  return (
    <div style={style}>
      <Grid container>
        <Grid xs={12}>
          <Typography variant='h3' align='center' color={'black'}>
            U.S. Quality of Life Map
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Map />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
