import { useState, useEffect } from 'react';
import { Box, Button, Chip, Checkbox, Drawer, FormControlLabel, FormControl, Typography, Card, CardActionArea, CardContent, styled, CardMedia, Divider } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import theme from '../theme'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useGetGearData } from '../dataHelpers';
import useMediaQuery from '@mui/material/useMediaQuery';


function GearCard({gear}: {gear: any}) {
  return (
    <CardActionArea LinkComponent={Link} href={gear.url} sx={{marginBottom: theme.spacing(2)}}>
      <Card variant='outlined' sx={{display: 'flex', minWidth: "100%", padding: theme.spacing(1), }}>
          <CardMedia 
            component='img'
            src={gear['image-url']}
            sx={{
              display: 'block',
              maxWidth: '100px',
              maxHeight: '100px',
              width: 'auto',
              height: 'auto',
            }}
          />
          <CardContent sx={{padding: 0}}>
            <Typography variant='h4'>
              {gear.name}
            </Typography>
            <Chip size='small' label={gear.equipmentType} />
            <Typography color='text.secondary' dangerouslySetInnerHTML={{ __html: gear.descriptionHtml}}></Typography>
          </CardContent>
      </Card>
    </CardActionArea>
  )
}

const Home = () => {
  const [ _gear, gearTags ] = useGetGearData();
  const [loading, setLoading] = useState(true)
  const [gear, setGear] = useState(_gear)
  const [filterOptions, setFilterOptions] = useState(gearTags)
  const { handleSubmit, reset, control } = useForm({mode: 'onChange'})

  useEffect(() => {
    setGear(_gear)
    if (_gear.length > 0) setLoading(false)
  }, [_gear])

  useEffect(() => {
    if (filterOptions.length === 0) setFilterOptions(gearTags)
    if (filterOptions.length > 0) setLoading(false)
  }, [gearTags])

  const filterData = (data:any) => {
    console.log('-----', data)
    const filteredGear = _gear.filter((g:any) => {
      let v = false
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          v = g[key] === "1"
          if (v === false) break
        }
      }
      return v
    })
    setGear(filteredGear)
  }


  const defaultValues:any = {}
  gearTags.forEach(filter => {
    defaultValues[filter.key] = false
  })
  const handleReset = () => {
    reset({defaultValues})
    setGear(_gear)
  }

  const drawer = (
    <Box sx={{ margin: theme.spacing(2)}}>
      <FormControl>
        <Button type='submit' variant='outlined' onClick={handleSubmit(filterData)}>Apply filters</Button>
        <Button variant='outlined' onClick={handleReset}>Reset</Button>
        <Typography variant='h5' sx={{ margin: theme.spacing(2) }}>Gear type</Typography>
        <Divider />
        <Typography variant='h5' sx={{ margin: theme.spacing(2) }}>Effect</Typography>
        <Divider />
        {filterOptions.map(filter => {
          return (
            <FormControlLabel
              key={filter.key}
              label={filter.key}
              control={
                <Controller
                  control={control}
                  name={filter.key}
                  defaultValue={false}
                  render={({field}) => {
                    return (
                      <Checkbox {...field} checked={field.value} />
                    )
                  }}
                />
              }
            />
          )
        })}
      </FormControl>
    </Box>
  )

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  console.log(gear)
  const showDesktopDrawer = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <>
    {!showDesktopDrawer && (<Button variant='contained' onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}>Open</Button>)}
    <Box sx={{display: 'flex'}}>
      {filterOptions.length > 0 && showDesktopDrawer ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            minHeight: '100vh',
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: theme.spacing(40) },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          open={isMobileDrawerOpen}
          sx={{
            minHeight: '100vh',
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: theme.spacing(40) },
          }}
        >

          <Button variant='contained' onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}>Close</Button>
          {drawer}
        </Drawer>
      )
      }
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: showDesktopDrawer ? theme.spacing(40) : 'inherit' }}>
        <Box>
        {gear.length > 0 ? gear.map((item) => {
            return item.name && (
              <GearCard key={item.name} gear={item} />
            )
          }
        ) : (
          loading ? <p>Gathering data....</p>: <p>nothing to report</p>
        )}
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default Home;
