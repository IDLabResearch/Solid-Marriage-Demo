import React, { useState } from 'react';
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
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HelpIcon from '@material-ui/icons/Help';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CardMembershipIcon from '@material-ui/icons/CardMembership';

import { Navbar } from 'react-bootstrap';
import { AuthButton, LogoutButton } from '@solid/react';

import MainScreenComponent from './MainScreenComponent';

import solidlogo from '../assets/solid-emblem.svg';
import idlablogo from '../assets/idlab.png';

import '../css/Drawer.css';
import { availableViews } from '../util/Util';
import useNotifications from '../hooks/useNotifications';

import { withWebId } from '@inrupt/solid-react-components';

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

const ClippedDrawer = withWebId((props) => {
  const classes = useStyles();

  const [selectedView, setSelectedView] = useState(availableViews.profile)
  const notifications = useNotifications(props.webId)

  const sidebarItems = {
    profile: {
      label: 'Profile',
      icon: <PersonIcon />,
      className: "active",
      eventHandler: function(e) { setSelectedView(availableViews.profile)}
    },
    documents: {
      label: 'Running requests',
      icon: <InsertDriveFileIcon />,
      className: "active",
      eventHandler: function(e) { setSelectedView(availableViews.running)}
    },
    certificates: {
      label: 'Certificates',
      icon: <CardMembershipIcon />,
      className: "active",
      eventHandler: function(e) { setSelectedView(availableViews.certificates)}
    },
    requests: {
      label: 'Requests',
      icon: <CardMembershipIcon />,
      className: "active",
      eventHandler: function(e) { setSelectedView(availableViews.requests)}
    },
    notifications: {
      label: 'Notifications',
      icon: <NotificationsIcon />,
      className: "active",
      eventHandler: function(e) { setSelectedView(availableViews.notifications)}
    },
    help: {
      label: 'Help',
      icon: <HelpIcon />,
      className: "active",
      eventHandler: function(e) { setSelectedView(availableViews.help)}
    }
  }

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


        <MenuItem className='topmenuitem topmenuitemleft' onClick={sidebarItems.help.eventHandler} >
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
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {[sidebarItems.profile, sidebarItems.requests, sidebarItems.documents, sidebarItems.certificates ].map((item, index) => (
              <ListItem button={true} className={item.classNane} button key={item.label} onClick={item.eventHandler}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
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

export default ClippedDrawer