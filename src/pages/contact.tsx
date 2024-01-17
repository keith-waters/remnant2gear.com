import { useState, MouseEventHandler } from 'react';
import {  Typography, AppBar, Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
import theme from '../theme'
import Link from 'next/link'
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const R2GAppBar = ({openDrawer}:{openDrawer?:MouseEventHandler<HTMLButtonElement>}) => {
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
const Home = () => {
  return (
    <>
      <R2GAppBar />
    </>
  );
};

export default Home;
