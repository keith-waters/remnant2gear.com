import { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Drawer, FormControlLabel, FormControl, Typography, Card, CardActionArea, CardContent, styled, CardMedia, Divider } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import theme from '../theme'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useGetGearData } from '../dataHelpers';

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
  const [ _gear, gearTypes, gearTags ] = useGetGearData();
  const [loading, setLoading] = useState(true)
  const [gear, setGear] = useState(_gear)

  useEffect(() => {
    setGear(_gear)
    if (_gear.length > 0) setLoading(false)
  }, [_gear])

  const getFilters = () => {
    return _gear.length > 0 ? Object.keys(_gear[0]).slice(5) : []
  }



  const filterOptions = gearTags
  const filterData = (data:any) => {
    const filteredGear = _gear.filter((g:any) => {
      let v = false
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          v = g[key] === '1'
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
        <Typography variant='h5' sx={{ margin: theme.spacing(2) }}>Gear type</Typography>
        <Divider />
        {gearTypes.map(filter => {
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
        <Typography variant='h5' sx={{ margin: theme.spacing(2) }}>Effect</Typography>
        <Divider />
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

  return (
    <Box sx={{display: 'flex'}}>
      <Drawer
        variant="permanent"
        open
        sx={{
          minHeight: '100vh',
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
          loading ? <p>Gathering data....</p>: <p>nothing to report</p>
        )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
