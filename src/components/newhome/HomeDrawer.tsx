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
import { useRouter } from 'next/router';
import * as React from 'react';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  position: 'relative',
  height: '100%',
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  position: 'relative',
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

type HomeDrawerProps = {
  // children: React.ReactChild;
  // page: number;
  // setPage: (int: number) => void;
  isDesktop: boolean;
};

export default function HomeDrawer({ isDesktop }: HomeDrawerProps) {
  // import Credits from '../../components/newhome/Credits';
  const [open, setOpen] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    setOpen(isDesktop);
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

  type DrawerIconButtonProps = {
    icon: JSX.Element;
    eventHandler: () => void;
  };

  const DrawerIconButton = ({ icon, eventHandler }: DrawerIconButtonProps) => {
    return (
      <IconButton
        onClick={eventHandler}
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
        {icon}
      </IconButton>
    );
  };

  return (
    // - 50px for banner, see BetaBanner.tsx
    <>
      <Drawer variant="permanent" open={open} sx={{ zIndex: 0 }}>
        <div
          className={`flex flex-row w-full justify-center items-center pt-2  ${
            isDesktop && 'h-16'
          }`}
        >
          {open ? (
            <>
              {/* <div className='absolute mt-1 left-1'>
                <Image src={logo} width="45px" height="45px" />
              </div> */}
              <h4 className="absolute left-4 text-defaultText">Planner</h4>
              <div className="absolute right-0">
                <DrawerIconButton icon={<ChevronLeftIcon />} eventHandler={handleDrawerChange} />
              </div>
            </>
          ) : (
            isDesktop && (
              <DrawerIconButton icon={<ChevronRightIcon />} eventHandler={handleDrawerChange} />
            )
          )}
        </div>
        <div className="flex flex-col justify-between h-full">
          <List>
            {['Home', 'Profile', 'Credits'].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: 'block',
                  bgcolor: '#E0E0E0',
                }}
              >
                <ListItemButton
                  onClick={() => {
                    // setPage(index);
                    router.push(`/app/${text.toLowerCase()}`);
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
                router.push('/auth/signOut');
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
      {/* {children} */}
      {/* </Box > */}
    </>
  );
}
