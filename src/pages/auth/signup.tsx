import { InferGetServerSidePropsType } from 'next';

import { AuthPage, getServerSideProps } from './login';

export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  return <AuthPage providers={providers} signUp />;
}

export { getServerSideProps } from './login';
