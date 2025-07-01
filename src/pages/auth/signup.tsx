import { InferGetServerSidePropsType } from 'next';
import React from 'react';

import { AuthPage, getStaticProps } from './login';

export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  return <AuthPage providers={providers} signUp />;
}

export { getStaticProps } from './login';
