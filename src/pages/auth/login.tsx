import logo from '@public/Nebula_Planner_Logo.png';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';
import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import React from 'react';

import { authOptions } from '../api/auth/[...nextauth]';

// import AuthCard from '../../components/auth/AuthCard';
// import LoginCard from '@components/auth/Login'

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function AuthPage({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [email, setEmail] = React.useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleEmailSignIn = () => {
    signIn('email', {
      email,
      callbackUrl: '/app',
    });
  };
  return (
    <>
      <div className="relative flex flex-col items-center justify-center h-screen space-y-10 bg-gradient-to-r from-purple-500 to-blue-500">
        <section>
          <div className="m-2 bg-white md:rounded-md md:shadow-md">
            <div className="bg-white md:shadow-lg shadow-none rounded p-6 w-96 ">
              <div className="mb-4 flex justify-center items-center">
                <Image src={logo} alt="Logo" width="120" height="120" className="rounded-full" />
              </div>
              <h1 className="text-center text-3xl mb-2 font-semibold leading-normal">Sign in</h1>
              <p className="text-sm leading-normal">
                Log in to your Nebula Profile to continue to Planner.
              </p>
              <section className="space-y-5 mt-5">
                <div className="mb-4 relative">
                  <input
                    type="email"
                    className="w-full border border-black p-3 rounded outline-none focus:border-black"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                    onKeyDown={(e) => {
                      if (e.key == 'Enter') {
                        handleEmailSignIn();
                      }
                    }}
                  ></input>
                </div>
                <button
                  onClick={handleEmailSignIn}
                  className="w-full text-center bg-blue-700 hover:bg-blue-800 text-lg rounded-lg text-white py-3"
                >
                  Sign in
                </button>
                {providers && 
                  <div className="items-center border-2 border-red-400 mx-auto rounded-lg -mb-6 pb-1">
                    <h4 className="text-center text-s text-gray-700">or</h4>
                  </div>}
                {providers &&
                  Object.values(providers).map((provider, idx) => (
                    <button
                      key={idx}
                      onClick={() => signIn(provider.id)}
                      className="appearance-none items-center justify-center block w-full bg-gray-100 text-gray-700 shadow border border-gray-500 rounded-lg py-3 px-3 leading-tight hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
                    >
                      <h4 className="text-center text-lg text-blue-700">
                        Sign in with {provider.name}
                      </h4>
                    </button>)
                  )}
                <div className="flex place-content-center">
                  <h4 className='text-lg'>
                    New to Nebula?
                    <Link legacyBehavior href="/auth/signup">
                      <a className="ml-2 text-blue-700 text-lg font-semibold hover:bg-blue-200 hover:rounded-lg">
                        Sign Up
                      </a>
                    </Link>
                  </h4>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // TODO: rethink this to prevent checking for session twice on redirect
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: { destination: '/app' },
    };
  }
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  if (providers && providers['email']) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    delete providers['email'];
  }
  return {
    props: { providers, csrfToken },
  };
}
