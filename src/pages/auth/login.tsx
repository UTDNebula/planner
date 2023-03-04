import logo from '@public/Nebula_Planner_Logo.png';
import { InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { getProviders, signIn, useSession } from 'next-auth/react';
import React from 'react';

import { useRouter } from 'next/router';
import AuthProviderIcons from "@/icons/AuthProviderIcons";

// import AuthCard from '../../components/auth/AuthCard';
// import LoginCard from '@components/auth/Login'

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function AuthPage({
  providers,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  const [email, setEmail] = React.useState('');
  const [showSignIn, setShowSignIn] = React.useState(true);

  // Lets just handle auth redirect on client side
  const router = useRouter();
  const { status } = useSession();

  React.useEffect(() => {
    if (router && status === 'authenticated') {
      router.push('/app');
    }
  }, [router, status]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleEmailSignIn = () => {
    signIn('email', {
      email,
      callbackUrl: '/app',
    });
  };

  const providerButtonProps: { [provider: string] : [classes: string] } = {
    "discord": ["bg-[#5865f2]"],
    "google": ["bg-[#EA4335]"],
    "facebook": ["bg-[#1877F2]"]
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center space-y-2 bg-slate-50">
      <div>
        <h1 className="text-center text-3xl font-bold leading-normal">planner.</h1>
      </div>
      <section className="w-full max-w-xl px-4">
        <div className="bg-white rounded-xl shadow">
          <div className="w-full rounded-xl bg-white p-4 shadow-none md:shadow-lg ">
            <h2 className="mb-2 text-center text-xl font-bold leading-normal">Sign in</h2>
            <section className="mt-4 space-y-2">
              {providers &&
                Object.values(providers).map((provider, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: '/app',
                      })
                    }
                    className={`border-gray-200 flex w-full appearance-none items-center justify-start rounded-md border ${providerButtonProps[provider.id]} px-4 py-2 space-x-2 leading-tight focus-visible:bg-gray-200 hover:bg-gray-200 focus-visible:outline-none text-gray-200 focus-visible:text-gray-700 hover:text-gray-700 h-10`}
                  >
                    { AuthProviderIcons[provider.id] }
                    <h4 className="text-left text-sm">
                      Continue with {provider.name}
                    </h4>
                  </button>
                ))}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
export async function getStaticProps() {
  const providers = await getProviders();

  if (providers && providers['email']) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    delete providers['email'];
  }
  return {
    props: { providers },
  };
}
