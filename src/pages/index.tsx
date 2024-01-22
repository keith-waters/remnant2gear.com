import { useState, useEffect, MouseEventHandler } from 'react';
import { Box, Button, Chip as MuiChip, Checkbox, Drawer, FormControlLabel, FormControl, Typography, Card, CardActionArea, CardContent, CardMedia, Divider, AppBar, Toolbar, IconButton, Menu, MenuItem, MenuList } from "@mui/material";
import theme from '../theme'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useGetGearData, removePTags } from '../dataHelpers';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu'
import LaunchIcon from '@mui/icons-material/Launch';

const Chip = (props:any) => {
  return <MuiChip size='small' sx={{marginRight: theme.spacing(1), marginBottom: theme.spacing(2)}} {...props} />
}

const baseUrl = 'https://remnant2.wiki.fextralife.com'
const R2GAppBar = ({openDrawer}:{openDrawer:MouseEventHandler<HTMLButtonElement>}) => {
  const showDesktopDrawer = useMediaQuery(theme.breakpoints.up('sm'));
  return (
  <AppBar position={!showDesktopDrawer ? "fixed" : "static"} sx={{ paddingLeft: !showDesktopDrawer ? 'inherit' : theme.spacing(40)}}>
  <Toolbar>
    {!showDesktopDrawer && 
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={openDrawer}
      >
        <MenuIcon />
      </IconButton>
    }
    <Typography
      variant="h6"
      noWrap
      component="div"
      sx={{ flexGrow: 1,  }}
    >
      Remnant 2 Gear
    </Typography>
    <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} href='/about'>
      <Typography sx={{ '&:hover': {textDecoration: 'underline'}}}>
        About 
      </Typography>
    </Link>
  </Toolbar>
  </AppBar>
  )
}

const getGearTags = (gear:{}) => {
  const tags:any[] = []
  Object.entries(gear).forEach(([key, value]) => {
    if(value === '1') tags.push(key.split('-').pop())
  })
  return tags;
}
const StandardContent = ({gear}:{gear:any}) => {
  const tags = getGearTags(gear)
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4' sx={{ marginBottom: theme.spacing(2)}}>
        {gear.name}
      </Typography>
      <Chip label={gear.equipmentType} />
      {gear.archetype && <Chip label={gear.archetype} />}
      {tags.map(t => <Chip label={t} key={t} />)}
      <Typography color='text.secondary' dangerouslySetInnerHTML={{ __html: removePTags(gear.descriptionHtml)}}></Typography>
      <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} target='_blank' href={baseUrl + gear.wikiUrl}>
        <Typography sx={{ '&:hover': {textDecoration: 'underline'}, marginTop: theme.spacing(2) }}>
          Go to Remnant 2 wiki <LaunchIcon sx={{ height: '1rem', width: '1rem'}}/>
        </Typography>
      </Link>
    </CardContent>
  )
}

const PerkContent = ({gear}:{gear:any}) => {
  const tags = getGearTags(gear)
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4' sx={{ marginBottom: theme.spacing(2)}}>
        {gear.name}
      </Typography>
      <Chip label={gear.equipmentType} />
      <Chip label={gear.archetype} />
      {tags.map(t => <Chip label={t} key={t} />)}
      <Typography color='text.secondary'><strong>Effect: </strong>{gear.perkEffect}</Typography>
      <Divider />
      <Typography color='text.secondary'><strong>Upgrade 1: </strong>{gear.perkUpgrade1}</Typography>
      <Divider />
      <Typography color='text.secondary'><strong>Upgrade 2: </strong>{gear.perkUpgrade2}</Typography>
      <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} target='_blank' href={baseUrl + gear.wikiUrl}>
        <Typography sx={{ '&:hover': {textDecoration: 'underline'}, marginTop: theme.spacing(2) }}>
          Go to Remnant 2 wiki <LaunchIcon sx={{ height: '1rem', width: '1rem'}}/>
        </Typography>
      </Link>
    </CardContent>
  )
}

const MutatorContent = ({gear}:{gear:any}) => {
  const tags = getGearTags(gear)
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4' sx={{ marginBottom: theme.spacing(2)}}>
        {gear.name}
      </Typography>
      <Chip label={gear.equipmentType} />
      <Chip label={gear.mutatorType} />
      {tags.map(t => <Chip label={t} key={t} />)}
      <Typography color='text.secondary' dangerouslySetInnerHTML={{ __html: gear.descriptionHtml}}></Typography>
      <Divider />
      <Typography color='text.secondary' sx={{ marginRight: theme.spacing(1)}}>
        <strong>Max level bonus: </strong>
        <Typography color='text.secondary' component='span' dangerouslySetInnerHTML={{ __html: gear.mutatorMaxLevelBonus}}></Typography>
      </Typography>
      <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} target='_blank' href={baseUrl + gear.wikiUrl}>
        <Typography sx={{ '&:hover': {textDecoration: 'underline'}, marginTop: theme.spacing(2) }}>
          Go to Remnant 2 wiki <LaunchIcon sx={{ height: '1rem', width: '1rem'}}/>
        </Typography>
      </Link>
    </CardContent>
  )
}

const TraitContent = ({gear}:{gear:any}) => {
  const tags = getGearTags(gear)
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4' sx={{ marginBottom: theme.spacing(2)}}>
        {gear.name}
      </Typography>
      <Chip label={gear.traitType}/>
      {tags.map(t => <Chip label={t} key={t} />)}
      <Typography color='text.secondary'>{gear.traitEffect}</Typography>
      <Divider />
      <Typography color='text.secondary'><strong>Max level bonus: </strong>{gear.traitMaxLevel}</Typography>
      <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} target='_blank' href={baseUrl + gear.wikiUrl}>
        <Typography sx={{ '&:hover': {textDecoration: 'underline'}, marginTop: theme.spacing(2) }}>
          Go to Remnant 2 wiki <LaunchIcon sx={{ height: '1rem', width: '1rem'}}/>
        </Typography>
      </Link>
    </CardContent>
  )
}

const GearCardContent = ({gear}:{gear:any}) => {
  if (gear.equipmentType === 'Perk') return <PerkContent gear={gear} />
  if (gear.equipmentType === 'Mutator') return <MutatorContent gear={gear} />
  if (gear.equipmentType === 'Trait') return <TraitContent gear={gear} />
  return <StandardContent gear={gear} />
}

function GearCard({gear}: {gear: any}) {
  const imgUrl = gear.wikiImageUrl ? baseUrl + gear.wikiImageUrl : '/android-chrome-192x192.png'
  return (
    <Card variant='outlined' sx={{display: 'flex', padding: theme.spacing(1), maxWidth: '88vw', marginBottom: theme.spacing(2)}}>
        <CardMedia 
          component='img'
          src={imgUrl}
          sx={{
            display: 'block',
            width: '75px',
            height: '75px',
            marginRight: theme.spacing(1)
          }}
          alt={gear.wikiImageAltText}
        />
        <GearCardContent gear={gear} />
    </Card>
  )
}

const Home = () => {
  const { gear: _gear, groups } = useGetGearData();
  const [loading, setLoading] = useState(true)
  const [gear, setGear] = useState(_gear)
  const { handleSubmit, reset, control, setValue } = useForm()
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
        params += `${key.trim()}=${value}&`
      }
    }

    if (params.slice(-1) === '&' || params.slice(-1) === '?') params = params.slice(0, -1)
    router.push(params, '', {shallow: true})
    setGear(filteredGear)
  }


  const handleReset = () => {
    reset()
    router.push('', '', {shallow: true})
    setGear(_gear)
  }

  const DrawerContent = ({showDesktopDrawer, setIsMobileDrawerOpen}:{showDesktopDrawer?: boolean, setIsMobileDrawerOpen?: Function}) => (
    <>
    <Toolbar disableGutters sx={{position: 'fixed', zIndex: theme.zIndex.drawer + 1, width: theme.spacing(40), backgroundColor: theme.palette.grey[800]}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <Button type='submit' variant='contained' onClick={() => {
          if(!showDesktopDrawer && setIsMobileDrawerOpen) setIsMobileDrawerOpen(false)
          handleSubmit(filterData)()
        }}>Apply filters</Button>
        <Button variant='contained' onClick={() => {
          if(!showDesktopDrawer && setIsMobileDrawerOpen) setIsMobileDrawerOpen(false)
          handleReset()
        }}>Reset</Button>
      </Box>
    </Toolbar>
    <Box sx={{ marginRight: theme.spacing(2), marginLeft: theme.spacing(2), marginBottom: theme.spacing(2)}}>
      <FormControl sx={{paddingTop: '64px'}}>
        {  
          Object.keys(groups).map((group:string) => {
            const g = groups[group];
            return (
              <Box key={g.groupName} sx={{ display: 'flex', flexDirection: 'column'}}>
                <Typography variant='h5' sx={{ marginTop: theme.spacing(2) }}>{group}</Typography><Divider />
                {g.tags.map((filter:any) => {
                  return (
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
                              <Checkbox {...field} checked={field.value}/>
                            )
                          }}
                        />
                      }
                    />
                  )
                })}
              </Box>
            )
          })
        }
      </FormControl>
    </Box>
    </>
  )

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const showDesktopDrawer = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <>
    <R2GAppBar openDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}/>
    <Box sx={{display: 'flex', paddingTop: !showDesktopDrawer ? '56px' : 'inherit'}}>
      {showDesktopDrawer ? (
        <Drawer
          key='desktop'
          variant="permanent"
          open
          sx={{
            minHeight: '100vh',
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: theme.spacing(40), top: '64' },
          }}
        >
          <DrawerContent />
        </Drawer>
      ) : (
        <Drawer
          key='mobile'
          open={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          sx={{
            minHeight: '100vh',
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: theme.spacing(40) },
          }}
        >
          <DrawerContent showDesktopDrawer={showDesktopDrawer} setIsMobileDrawerOpen={setIsMobileDrawerOpen}/>
        </Drawer>
      )
      }
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ paddingLeft: showDesktopDrawer ? theme.spacing(40) : 0 }}>
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
