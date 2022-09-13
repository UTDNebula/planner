import '@fontsource/jost';

import { styled } from '@material-ui/core/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';

const pages = ['Overview', 'Features', 'Learn More'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

interface Props {
  ref1: any;
  ref2: any;
  ref3: any;
}

export default function ResponsiveAppBar({ ref1, ref2, ref3 }: Props): JSX.Element {
  const refHolder = [ref1, ref2, ref3];

  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  function scrollTo(ref) {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }

  return (
    // <div className="h-10 w-screen bg-purple-900">Hi Bye</div>
    <Box sx={{ flexGrow: 1 }} className="bg-white">
      <AppBar
        position="relative"
        style={{
          backgroundColor: 'rgba(70, 89, 167, 0.25)',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => scrollTo(refHolder[pages.indexOf(page)])}
                  ref={refHolder[pages.indexOf(page)]}
                  // href={`#${page}`}
                  sx={{
                    p: 2,
                    my: 2,
                    color: 'black',
                    display: 'block',
                    textTransform: 'none',
                    fontSize: '24px',
                    fontFamily: 'Jost',
                    letterSpacing: '-0.25px',
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <div className="flex flex-row space-x-5">
              <Button
                sx={{
                  color: 'black',
                  fontFamily: 'Jost',
                  letterSpacing: '0px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
                href="/auth/login"
              >
                LOG IN
              </Button>
              <Button
                variant="contained"
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#4659A7',
                  fontFamily: 'Jost',
                  fontSize: '18px',
                }}
                href="/auth/signup"
              >
                GET STARTED
              </Button>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
