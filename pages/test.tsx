import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import Image from 'next/image';
import * as React from 'react';

import Home from '../components/newhome/Home';
import Profile from '../components/newhome/Profile';
import Profile2 from '../components/newhome/Profile2';
import useMedia from '../modules/common/media';
import logo from '../public/Nebula_Planner_Logo.png';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(true);
  const [page, setPage] = React.useState(0);

  const isDesktop = useMedia('(min-width: 768px)');

  React.useEffect(() => {
    setOpen(false);
  }, [isDesktop]);

  const handleDrawerChange = () => {
    setOpen(!open);
  };

  const IconList = [
    <HomeIcon key={0} />,
    <AccountCircleIcon key={1} />,
    <AssignmentIcon key={2} />,
    <LogoutIcon key={3} />,
  ];

  const content = [
    <Home key={0} />,
    <Profile2 key={1} />,
    <Profile isDesktop={isDesktop} key={2} />,
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" open={open}>
        <div className="flex flex-row w-full items-center pt-2 ml-0.5">
          {open ? (
            <>
              <IconButton
                onClick={handleDrawerChange}
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '&:focus': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <Image src={logo} width="45px" height="45px" />
              </IconButton>
              <h4 className="text-defaultText ml-0.5 flex-grow">Planner</h4>
              <IconButton
                onClick={handleDrawerChange}
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '&:focus': {
                    backgroundColor: 'white',
                  },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            </>
          ) : (
            isDesktop && (
              <IconButton
                onClick={handleDrawerChange}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            )
          )}
        </div>
        <div className="flex flex-col justify-between h-full">
          <List>
            {['Home', 'Profile', 'Credits'].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{ display: 'block', bgcolor: index === page ? '#E0E0E0' : undefined }}
              >
                <ListItemButton
                  onClick={() => {
                    setPage(index);
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {IconList[index]}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <ListItem key={'Log Out'} disablePadding sx={{ display: 'block', paddingBottom: '20px' }}>
            <ListItemButton
              onClick={() => {
                setPage(3);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {IconList[3]}
              </ListItemIcon>
              <ListItemText primary={'Log Out'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </div>
      </Drawer>
      <div className="w-full h-screen overflow-y-scroll bg-[#F5F5F5]">{content[page]}</div>
    </Box>
  );
}
