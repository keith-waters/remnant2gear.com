import { useState, useEffect } from 'react';
import { Box, Button, Chip, Checkbox, Drawer, FormControlLabel, FormControl, Typography, Card, CardActionArea, CardContent, CardMedia, Divider } from "@mui/material";
import theme from '../theme'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useGetGearData } from '../dataHelpers';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';

const StandardContent = ({gear}:{gear:any}) => {
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4'>
        {gear.name}
      </Typography>
      <Chip size='small' label={gear.equipmentType} />
      <Typography color='text.secondary' dangerouslySetInnerHTML={{ __html: gear.descriptionHtml}}></Typography>
    </CardContent>
  )
}

const PerkContent = ({gear}:{gear:any}) => {
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4'>
        {gear.name}
      </Typography>
      <Chip size='small' label={gear.equipmentType} sx={{marginRight: theme.spacing(1)}}/>
      <Chip size='small' label={gear.archetype} sx={{marginRight: theme.spacing(1)}}/>
      <Chip size='small' label={gear.perkType} sx={{marginRight: theme.spacing(1)}}/>
      <Typography color='text.secondary'><strong>Effect: </strong>{gear.perkEffect}</Typography>
      <Divider />
      <Typography color='text.secondary'><strong>Upgrade 1: </strong>{gear.perkUpgrade1}</Typography>
      <Divider />
      <Typography color='text.secondary'><strong>Upgrade 2: </strong>{gear.perkUpgrade2}</Typography>
    </CardContent>
  )
}

const GearCardContent = ({gear}:{gear:any}) => {
  if (gear.equipmentType === 'Perk') return <PerkContent gear={gear} />
  return <StandardContent gear={gear} />
}

function GearCard({gear}: {gear: any}) {
  const baseUrl = 'https://remnant2.wiki.fextralife.com'
  const imgUrl = gear.wikiImageUrl ? baseUrl + gear.wikiImageUrl : '/android-chrome-192x192.png'
  return (
    <CardActionArea LinkComponent={Link} href={gear.url} sx={{marginBottom: theme.spacing(2)}}>
      <Card variant='outlined' sx={{display: 'flex', minWidth: "100%", padding: theme.spacing(1), }}>
          <CardMedia 
            component='img'
            src={imgUrl}
            sx={{
              display: 'block',
              width: '75px',
              height: '75px',
              marginRight: theme.spacing(1)
            }}
          />
          <GearCardContent gear={gear} />
      </Card>
    </CardActionArea>
  )
}

const Home = () => {
  const { gear: _gear, groups } = useGetGearData();
  const [loading, setLoading] = useState(true)
  const [gear, setGear] = useState(_gear)
  const { handleSubmit, reset, control, setValue } = useForm({mode: 'onChange'})
  const router = useRouter()

  useEffect(() => {
    const keys = Object.keys(router.query)
    if(keys.length > 0) {
      keys.forEach(key => setValue(key, !!router.query[key]))
      handleSubmit(filterData)()
    } else {
      setGear(_gear)
    }
    if (_gear.length > 0) setLoading(false)
  }, [_gear])

  const filterData = (data:any) => {
    const filteredGear = _gear.filter((g:any) => {
      let v = false
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          v = g[key] === "1" || g.equipmentType === key
          if (v === false) break
        }
      }
      return v
    })
    let params = '?'
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        params += `${key}=${value}&`
      }
    }

    if (params.slice(-1) === '&' || params.slice(-1) === '?') params = params.slice(0, -1)
    router.push(params, '', {shallow: true})
    setGear(filteredGear)
  }


  const handleReset = () => {
    reset()
    setGear(_gear)
  }

  const drawer = (
    <Box sx={{ margin: theme.spacing(2)}}>
      <FormControl>
        <Button type='submit' variant='outlined' onClick={handleSubmit(filterData)}>Apply filters</Button>
        <Button variant='outlined' onClick={handleReset}>Reset</Button>
        {  
          Object.keys(groups).map((group:string) => {
            const g = groups[group];
            return (
              <Box key={group} sx={{ display: 'flex', flexDirection: 'column'}}>
                <Typography variant='h5' sx={{ marginTop: theme.spacing(2) }}>{group}</Typography><Divider />
                {g.tags.map((filter:any) => {
                  return (
                    <>
                      <FormControlLabel
                        key={filter.key}
                        label={filter.label}
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
                    </>
                  )
                })}
              </Box>
            )
          })
        }
      </FormControl>
    </Box>
  )

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const showDesktopDrawer = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <>
    {!showDesktopDrawer && (<Button variant='contained' onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}>Open</Button>)}
    <Box sx={{display: 'flex'}}>
      {showDesktopDrawer ? (
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
