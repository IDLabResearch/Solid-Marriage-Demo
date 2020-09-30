import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { availableViews, activeDrawerItemMapping } from '../util/Util';
import useNotifications from '../hooks/useNotifications';
import { withWebId } from '@inrupt/solid-react-components';
import MainScreenComponent from './MainScreenComponent';
import { Navbar } from 'react-bootstrap';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import { LogoutButton } from '@solid/react';

import solidlogo from '../assets/solid-emblem.svg';
import idlablogo from '../assets/idlab.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const MiniDrawer = withWebId((props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const [selectedView, setSelectedView] = useState(availableViews.profile)
  const notifications = useNotifications(props.webId)

  const getSideBarItem = (itemId) => { return({
    id: availableViews[itemId].id,
    label: availableViews[itemId].label,
    icon: availableViews[itemId].icon,
    eventHandler: function(e) { setSelectedView(availableViews[itemId])}
  })}

  const sidebarItems = {}
  
  for (let item of ['profile', 'running', 'requests', 'certificates', 'official', 'notifications', 'help']){
    sidebarItems[item] = getSideBarItem(item)
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const isActive = (item) => {
    console.log('active', activeDrawerItemMapping.item)
    console.log('isActive?', item, selectedView)

  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            SEMIC - solid demo
          </Typography>


          <Navbar.Brand href="https://solidproject.org/">
            <img
              alt=""
              width='50px'
              src={solidlogo}
            />{' '}
          </Navbar.Brand>

          <Navbar.Brand href="https://www.ugent.be/ea/idlab/en">
            <img
              alt=""
              src={idlablogo}
              height="40px"
            />{' '}
          </Navbar.Brand>


          <MenuItem className='topmenuselectedViewitem topmenuitemleft' onClick={sidebarItems.help.eventHandler} >
            <IconButton aria-label={sidebarItems.help.label} color="inherit">
              {sidebarItems.help.icon}
            </IconButton>
          </MenuItem>

          <MenuItem className='topmenuitem' onClick={sidebarItems.notifications.eventHandler} >
            <IconButton aria-label={sidebarItems.notifications.label} color="inherit">
              <Badge badgeContent={notifications.length} color="secondary">
                {sidebarItems.notifications.icon}
              </Badge>
            </IconButton>
          </MenuItem>

          <MenuItem className='topmenuitem'>
            <LogoutButton className="logoutButton"/>
          </MenuItem>

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={`${clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })} sidebar`}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <Toolbar className={`${classes.toolbar} toolbarcolor`}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <div className='sidebarcontent'>
          <List>
            {[getSideBarItem('profile'), getSideBarItem('requests'), getSideBarItem('running'), getSideBarItem('certificates') ].map((item, index) => (
              <ListItem button={true} className={isActive(item) ? 'active' : 'nonactive'} button key={item.label} onClick={item.eventHandler}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <br />
          <Divider />
          {[sidebarItems.official].map((item, index) => (
            <ListItem button={true} className={item.classNane} button key={item.label} onClick={item.eventHandler}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          <Divider />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <MainScreenComponent webId={props.webId} selectedView={selectedView} setSelectedView ={setSelectedView} ></MainScreenComponent>
      </main>
    </div>
  );
})

export default MiniDrawer
