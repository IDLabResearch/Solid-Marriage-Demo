import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import { Navbar } from 'react-bootstrap';

import solidlogo from '../assets/solid-emblem.svg';
import idlablogo from '../assets/idlab.png';
import { AuthButton } from '@solid/react';


import '../css/Drawer.css';
import LoginComponent from './LoginComponent';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function EmptyDrawer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          
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
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
        </div>
      </Drawer>
      <main className={classes.content}>
        <LoginComponent></LoginComponent>
      </main>
    </div>
  );
}