import Head from 'next/head';
import React from 'react';
import { useDispatch } from 'react-redux';
import UserWelcome from '../../components/home/UserWelcome';
import { useAuthContext } from '../../modules/auth/auth-context';
import { loadUser } from '../../modules/redux/userDataSlice';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

/**
 * The home screen for the app.
 * If the user has a valid Firebase id, then the data will be loaded.
 */
export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col w-full h-full">
      <Head>
        <title>Nebula - Home</title>
      </Head>
      <UserWelcome />
    </div>
  );
}
