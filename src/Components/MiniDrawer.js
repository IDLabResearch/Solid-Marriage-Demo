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

import '../css/Drawer.css'


import solidlogo from '../assets/solid-emblem.svg';
import idlablogo from '../assets/idlab.png';
import { Link } from 'react-router-dom';

var drawerWidth = 240;

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
  const [open, setOpen] = React.useState(true);

  const [selectedView, setSelectedView] = useState(availableViews[props.defaultview] || availableViews.profile)
  const notifications = useNotifications(props.webId)


  const isActive = (item) => item.id === activeDrawerItemMapping[selectedView.id]

  const getSidebarComponent = (itemName, index) => { 
    const item = availableViews[itemName]
    switch (itemName) {
      case 'divider':
        return (<Divider key={index}/>)
      case 'br':
        return (<br key={index}/>)
      case 'help':
        return (
          <Link to="/help" target="_blank" style={{ textDecoration: 'none', color: "black" }}>
            <ListItem button={true} className={isActive(item) ? 'active' : 'nonactive'} button key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </Link>
        )
      default:
        if (!item) return <div />
        return (
          <ListItem button={true} className={isActive(item) ? 'active' : 'nonactive'} button key={index} onClick={() => setSelectedView(item)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        )
    }
  }

  // const openApp = () => { if(window.location.endsWith('help')) window.open(window.location)
  // const openHelp = () => window.open(window.location + 'help')

  const getTopBarComponent = (itemName, index) => {
    const item = availableViews[itemName]
    const className = index === 0 ? 'topmenuitem topmenuitemleft' : 'topmenuitem'
    switch (itemName) {
      case 'notifications':
        return (
          <MenuItem className={className} onClick={() => setSelectedView(item)} key={index}>
            <IconButton aria-label={item.label} color="inherit">
                <Badge badgeContent={notifications.length} color="secondary">
                  {item.icon}
                </Badge>
            </IconButton>
          </MenuItem>
        )
      case 'help':
        return (
          <Link to="/help" target="_blank" key={index + 'helplink'}>
            <MenuItem className={className} key={index}>
              <IconButton aria-label={item.label} style={{color: "white"}}>
                  {item.icon}
              </IconButton>
            </MenuItem>
          </Link>
        )
      default:
        return (
          <MenuItem className={className} onClick={() => setSelectedView(item)} key={index}>
            <IconButton aria-label={item.label} color="inherit">
              {item.icon}
            </IconButton>
          </MenuItem>
        )
    }
  }

  const sideBarItems = props.sideBarItems || ['profile', 'requests', 'running', 'certificates', 'divider', 'br', 'divider', 'official', 'divider']
  const sidebarComponents = sideBarItems.map((e, index) => getSidebarComponent(e, index))

  const topBarItems = props.topBarItems || ['notifications', 'help']
  const topbarComponents = topBarItems.map((e, index) => getTopBarComponent(e, index))

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  drawerWidth = sidebarComponents.length ? drawerWidth : 0;

  const classes = useStyles();
  const theme = useTheme();

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

          <Link to="/" target="_blank">
            <Typography variant="h6" style={{color: "white"}} noWrap>
              SEMIC - solid demo
            </Typography>
          </Link>
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

          {topbarComponents}
          {props.hidelogout 
            ? <div />
            : <MenuItem className='topmenuitem'>
                <LogoutButton className="logoutButton"/>
              </MenuItem>}

        </Toolbar>
      </AppBar>
      {sidebarComponents.length
      ?
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
              {theme.direction === 'rtl' ? <ChevronRightIcon style={{fill: "white"}}/> : <ChevronLeftIcon style={{fill: "white"}}/>}
            </IconButton>
          </Toolbar>
          <Divider />
          <div className='sidebarcontent'>
            <List>
              {sidebarComponents}
            </List>
          </div>
        </Drawer>
      : <div />}
      
      <main className={classes.content}>
        <Toolbar />
        <MainScreenComponent webId={props.webId} selectedView={selectedView} setSelectedView ={setSelectedView} ></MainScreenComponent>
      </main>
    </div>
  );
})

export default MiniDrawer
