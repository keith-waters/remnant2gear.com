import { useState, useEffect, MouseEventHandler } from 'react';
import { Box, Button, Chip, Checkbox, Drawer, FormControlLabel, FormControl, Typography, Card, CardActionArea, CardContent, CardMedia, Divider, AppBar, Toolbar, IconButton, Menu, MenuItem, MenuList } from "@mui/material";
import theme from '../theme'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useGetGearData } from '../dataHelpers';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const R2GAppBar = ({openDrawer}:{openDrawer:MouseEventHandler<HTMLButtonElement>}) => {
  const showDesktopDrawer = useMediaQuery(theme.breakpoints.up('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
  <AppBar position="static" sx={{ paddingLeft: !showDesktopDrawer ? 'inherit' : theme.spacing(40)}}>
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
    <IconButton
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu 
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiMenu-paper': { width: theme.spacing(20) },
        }}
      >
        <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} href='/contact'>
          <MenuItem>
            Contact
          </MenuItem>
        </Link>
      </Menu>
  </Toolbar>
  </AppBar>
  )
}

const StandardContent = ({gear}:{gear:any}) => {
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4'>
        {gear.name}
      </Typography>
      <Chip size='small' label={gear.equipmentType} />
      <Typography color='text.secondary' sx={{ marginRight: theme.spacing(1)}}>
        <strong>Effect: </strong>
        <Typography color='text.secondary' component='span' dangerouslySetInnerHTML={{ __html: gear.descriptionHtml}}></Typography>
      </Typography>
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

const MutatorContent = ({gear}:{gear:any}) => {
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4'>
        {gear.name}
      </Typography>
      <Chip size='small' label={gear.equipmentType} sx={{marginRight: theme.spacing(1)}}/>
      <Chip size='small' label={gear.mutatorType} sx={{marginRight: theme.spacing(1)}}/>
      <Typography color='text.secondary' sx={{ marginRight: theme.spacing(1)}}>
        <strong>Effect: </strong>
        <Typography color='text.secondary' component='span' dangerouslySetInnerHTML={{ __html: gear.descriptionHtml}}></Typography>
      </Typography>
      <Divider />
      <Typography color='text.secondary' sx={{ marginRight: theme.spacing(1)}}>
        <strong>Max level bonus: </strong>
        <Typography color='text.secondary' component='span' dangerouslySetInnerHTML={{ __html: gear.mutatorMaxLevelBonus}}></Typography>
      </Typography>
    </CardContent>
  )
}

const TraitContent = ({gear}:{gear:any}) => {
  return (
    <CardContent sx={{padding: 0}}>
      <Typography variant='h4'>
        {gear.name}
      </Typography>
      <Chip size='small' label={gear.traitType} sx={{marginRight: theme.spacing(1)}}/>
      <Typography color='text.secondary'><strong>Effect: </strong>{gear.traitEffect}</Typography>
      <Divider />
      <Typography color='text.secondary'><strong>Max level bonus: </strong>{gear.traitMaxLevel}</Typography>
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
  const baseUrl = 'https://remnant2.wiki.fextralife.com'
  const imgUrl = gear.wikiImageUrl ? baseUrl + gear.wikiImageUrl : '/android-chrome-192x192.png'
  return (
    <CardActionArea LinkComponent={Link} href={gear.url} sx={{marginBottom: theme.spacing(2)}}>
      <Card variant='outlined' sx={{display: 'flex', padding: theme.spacing(1), maxWidth: '88vw'}}>
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
    </CardActionArea>
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
        params += `${key}=${value}&`
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
    <Box sx={{ marginRight: theme.spacing(2), marginLeft: theme.spacing(2), marginBottom: theme.spacing(2)}}>

      <Toolbar disableGutters sx={{position: 'fixed', zIndex: theme.zIndex.drawer + 1, width: theme.spacing(32)}}>
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
  )

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const showDesktopDrawer = useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <>
    <R2GAppBar openDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}/>
    <Box sx={{display: 'flex'}}>
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
