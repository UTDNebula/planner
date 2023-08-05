import { InferGetServerSidePropsType } from 'next';

import { AuthPage, getStaticProps } from './login';

export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  return <AuthPage providers={providers} signUp />;
}

export { getStaticProps } from './login';
