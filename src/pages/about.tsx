import { useState, MouseEventHandler } from 'react';
import {  Typography, AppBar, Toolbar, IconButton, Menu, MenuItem, Box } from "@mui/material";
import theme from '../theme'
import Link from 'next/link'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const R2GAppBar = () => {
  return (
  <AppBar position="sticky">
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
    <Link style={{ textDecoration: "none", color: theme.palette.text.primary }} href='/about'>
      <Typography sx={{ '&:hover': {textDecoration: 'underline'}}}>
        About 
      </Typography>
    </Link>
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
