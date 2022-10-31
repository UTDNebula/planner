import { styled } from '@material-ui/core/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
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

  const router = useRouter();

  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: 'rgb(216,212,236)',
        boxShadow: 'none',
        height: '80px',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: '999',
        paddingLeft: '70px',
        paddingRight: '70px',
      }}
    >
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => scrollTo(refHolder[pages.indexOf(page)])}
          ref={refHolder[pages.indexOf(page)]}
          // href={`#${page}`}
          sx={{
            marginRight: '30px',
            color: 'black',
            display: 'block',
            textTransform: 'none',
            fontSize: '20px',
            letterSpacing: '-0.25px',
          }}
        >
          {page}
        </Button>
      ))}
      <div className="flex-grow"></div>

      <div className="flex flex-row space-x-5">
        <Button
          sx={{
            color: 'black',
            marginRight: '20px',
            letterSpacing: '0px',
            fontSize: '18px',
          }}
          onClick={() => router.push('/auth/login')}
        >
          LOG IN
        </Button>
        <Button
          variant="contained"
          style={{
            borderRadius: '10px',
            backgroundColor: '#4659A7',
            fontSize: '18px',
          }}
          onClick={() => router.push('/auth/signup')}
        >
          GET STARTED
        </Button>
      </div>
    </AppBar>
  );
}
