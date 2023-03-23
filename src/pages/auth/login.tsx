import { InferGetServerSidePropsType } from 'next';
import { getProviders, signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import EmojiIcon from '@/icons/EmojiIcon';

import { useRouter } from 'next/router';
import AuthIcons from '@/icons/AuthIcons';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Button from '@/components/Button';

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function AuthPage({
  providers,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  const [email, setEmail] = React.useState('');

  // Lets just handle auth redirect on client side
  const router = useRouter();
  const { status } = useSession();
  const [isModifyLoading, setIsModifyLoading] = React.useState(false);

  React.useEffect(() => {
    if (router && status === 'authenticated') {
      router.push('/app/home');
    }
  }, [router, status]);

  useEffect(() => {
    if (router.asPath.includes('OAuthAccountNotLinked')) {
      toast.warn(
        'You already have an account with this email. Try signing in with a different sign in method, or sign up with a different email.',
        {
          autoClose: false,
        },
      );
    }
  }, [router.asPath]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleEmailSignIn = () => {
    signIn('email', {
      email,
      callbackUrl: '/app/home',
    });
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center space-y-10 bg-[#ffffff]">
      {status !== 'loading' && (
        <section>
          <div className="w-auto">
            <div className="flex flex-wrap">
              <div>{EmojiIcon['waveEmoji']}</div>
              <h1 className="-mt-2 ml-2 text-3xl text-[36px] font-bold leading-normal tracking-tight">
                Welcome Back!
              </h1>
            </div>
            <p className="text-sm text-[16px] font-medium leading-normal text-[#737373]">
              Sign in to continue using Nebula Planner
            </p>
            <section className="mt-7 space-y-5 ">
              {/* Change functionality of login */}
              <div className="relative mb-4">
                <input
                  type="email"
                  className="w-[500px] rounded border bg-[#F5F5F5] p-3 pl-4 text-[14px] text-[#737373] outline-none focus:border-[#6366F1]"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email Address"
                  onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                      handleEmailSignIn();
                    }
                  }}
                ></input>
              </div>
              <Button
                className="hover:bg-[#EEF2FF] hover:text-[#312E81]"
                width="full"
                size="large"
                font="large"
                isLoading={isModifyLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModifyLoading(true);
                  handleEmailSignIn();
                }}
              >
                Continue
              </Button>
              {providers && (
                <div className="relative flex items-center py-5">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="mx-4 flex-shrink font-medium text-gray-400">
                    or log in using other accounts
                  </span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>
              )}
              <div className="flex w-full appearance-none items-center justify-center rounded-lg pb-4">
                {providers &&
                  Object.values(providers).map((provider, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        signIn(provider.id, {
                          callbackUrl: '/app/home',
                        });
                      }}
                      className={`-ml-2 h-10 rounded-full px-3 text-gray-200 `}
                    >
                      {AuthIcons[provider.id]}
                    </button>
                  ))}
              </div>
              <div className="flex place-content-center">
                <h4 className="text-lg font-normal text-[#A3A3A3]">
                  Don&apos;t have an account?{' '}
                  <Link
                    className="font-semibold text-[#4F46E5] hover:underline"
                    href="/auth/signup"
                  >
                    Sign up
                  </Link>
                </h4>
              </div>
            </section>
          </div>
        </section>
      )}
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
