import { useState } from 'react';
import { Box, Button, Checkbox, Drawer, FormControlLabel, FormControl, Typography, Card, CardActionArea, CardContent, styled, CardMedia } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import theme from '../theme'
import _gear from "../data.json"
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'

function GearCard({gear}: {gear: any}) {
  return (
    <CardActionArea LinkComponent={Link} href={gear.url}>
      <Card variant='outlined' sx={{display: 'flex', marginTop: theme.spacing(2), marginBottom: theme.spacing(2), maxWidth: "400px"}}>
          <CardMedia 
            component='img'
            src={gear.image}
            sx={{width: '200px'}}
          />
          <CardContent>
            <Typography variant='h4'>
              {gear.Name}
            </Typography>
            <Typography color='text.secondary'>
              {gear.Description}
            </Typography>
          </CardContent>
      </Card>
    </CardActionArea>
  )
}


const Home = () => {
  const [gear, setGear] = useState(_gear)
  const getFilters = () => {
    return Object.keys(_gear[0]).slice(6)
  }
  const filterOptions = getFilters()
  const filterData = (data:any) => {
    console.log('>>>', data)
    const filteredGear = _gear.filter((g:any) => {
      let v = false
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          v = g[key] === 1
          if (v === false) break
        }
      }
      return v
    })
    setGear(filteredGear)
  }

  const defaultValues:any = {}
  filterOptions.forEach(f => {
    defaultValues[f] = false;
  })
  const { handleSubmit, reset, control } = useForm({defaultValues})

  const handleReset = () => {
    reset()
    setGear(_gear)
  }

  const drawer = (
    <Box>
      <FormControl>
        <Button type='submit' variant='outlined' onClick={handleSubmit((filterData))}>Apply filters</Button>
        <Button variant='outlined' onClick={handleReset}>Reset</Button>
        {filterOptions.map(filter => {
          return (
            <FormControlLabel
              key={filter}
              label={filter}
              control={
                <Controller
                  control={control}
                  name={filter}
                  render={({field}) => (<Checkbox {...field} checked={field.value ?? false} />)}
                />
              }
            />
          )
        })}
      </FormControl>
    </Box>
  )

  const filterBy = (filter: string) => {
    const filteredGear = gear.filter((g:any) => g[filter] === 1)
    setGear(filteredGear)
  }

  return (
    <Box sx={{display: 'flex'}}>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: theme.spacing(40), position: 'relative' },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
        {gear.length > 0 ? gear.map((item) => {
            return item.Name && (
              <Grid key={item.Name}>
                <GearCard gear={item} />
              </Grid>
            )
          }
        ) : (
          <p>nothing to report</p>
        )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
