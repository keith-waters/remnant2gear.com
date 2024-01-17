import { useState, MouseEventHandler } from 'react';
import {  Typography, AppBar, Toolbar, IconButton, Menu, MenuItem, Box } from "@mui/material";
import theme from '../theme'
import Link from 'next/link'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const R2GAppBar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
  <AppBar position="static">
  <Toolbar>
    <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} href='/'>
      <Typography
        variant="h6"
        noWrap
        component="div"
      >
        Remnant 2 Gear
      </Typography>
    </Link>
    <Box sx={{ flexGrow: 1 }}/>
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
const Home = () => {
  const imgUrl = '/android-chrome-192x192.png'
  return (
    <>
      <R2GAppBar />

      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: theme.spacing(2), justifyContent: 'space-between', height: '500px' }}>
        <img src={imgUrl} width={100}/>
        <Typography variant='h4'>Thanks for checking out remnant2gear.com!</Typography>

        <Typography>
          This all started with me and two of my friends playing a lot of Remnant 2.
        </Typography>
        <Typography>
          One of them was so into it, he made a spread sheet to help filter the gear and make builds.
        </Typography>
        <Typography>
          And me being a web dev got excited about turning that spread sheet into this website!
        </Typography>

        <Typography>
          If you have any questions, comments, or suggestions, reach out to my on twitter/X <a href='https://twitter.com/readingwaters'>@readingwaters</a> or on <a href='https://www.reddit.com/user/readingwaters'>reddit</a>!
        </Typography>
      </Box>
    </>
  );
};

export default Home;
