import { useState } from 'react';
import { Box, Typography, Card, CardHeader, CardContent, List, ListItem, styled, CardMedia } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import _gear from "../data.json"

const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: "column",
  },
}))


const Home = () => {
  const [gear, setGear] = useState(_gear)
  const getFilters = () => {
    return Object.keys(_gear[0]).slice(6)
  }

  const filterByWeakspot = (filter: string) => {
    const filteredGear = gear.filter(g => g[filter] === 1)
    setGear(filteredGear)
  }
  return (
    <div>
      {getFilters().map(filter => {
        return (
          <button key={filter} onClick={() => filterByWeakspot(filter)}>filter by {filter}</button>
        )
      })}
      <Grid container spacing={2}>
      {gear.length > 0 ? gear.map((item) => {

          return item.Name && (
            <Grid>
              <Card variant='outlined' key={item.Name} sx={{maxWidth: "500px"}}>
                <CardContent>
                  <Typography component="div" variant="h5">
                    { item.Name }
                  </Typography>
                  <p>{ item.Description }</p>
                </CardContent>
              </Card>
            </Grid>
          )
        }
      ) : (
        <p>nothing to report</p>
      )}
      </Grid>
    </div>
  );
};

export default Home;
