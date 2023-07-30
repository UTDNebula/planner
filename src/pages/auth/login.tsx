import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@/components/Button';
import AuthIcons from '@/icons/AuthIcons';
import EmojiIcon from '@/icons/EmojiIcon';
import { trpc } from '@/utils/trpc';
import { isValidEmail } from '@/utils/utilFunctions';

// Time elapsed after typing email to display error
const EMAIL_VALIDATION_ERROR_TIMEOUT_MS = 600;

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  return <AuthPage providers={providers} />;
}

export function AuthPage(props: {
  providers: Awaited<ReturnType<typeof getProviders>>;
  signUp?: boolean;
}): JSX.Element {
  const { providers } = props;
  const signUp = props.signUp ?? false;
  const [email, setEmail] = useState('');

  // Lets just handle auth redirect on client side
  const router = useRouter();
  const { status } = useSession();
  const [isModifyLoading, setIsModifyLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const displayEmailError = useMemo(() => !isEmailValid && email !== '', [isEmailValid, email]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch courses here and put in cache
  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
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
    setIsEmailValid(true);
    setTimeout(
      () => setIsEmailValid(isValidEmail(event.target.value)),
      EMAIL_VALIDATION_ERROR_TIMEOUT_MS,
    );
    setEmail(event.target.value);
  };

  const handleEmailSignIn = () => {
    if (isEmailValid) {
      setIsModifyLoading(true);
      signIn('email', {
        email,
        callbackUrl: '/app/home',
      });
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center space-y-10 bg-[#ffffff]">
      {status !== 'loading' && (
        <section className="w-full min-w-[300px] max-w-xl p-5 sm:w-2/3">
          <div className="flex flex-wrap items-center">
            <div>{signUp ? EmojiIcon['sparkle'] : EmojiIcon['waveEmoji']}</div>
            <h1 className="-mt-2 ml-2 text-2xl text-[36px] font-bold leading-normal tracking-tight lg:text-3xl">
              {signUp ? 'Create An Account' : 'Welcome Back!'}
            </h1>
          </div>
          <p className="text-[16px] text-sm font-medium leading-normal text-[#737373]">
            {signUp
              ? 'Welcome to Nebula Planner! To get started, please sign up below.'
              : 'Sign in to continue using Nebula Planner'}
          </p>
          <section className="mt-7 space-y-5 ">
            <div className="relative mb-4">
              <input
                ref={inputRef}
                type="email"
                className={`w-full rounded border bg-[#F5F5F5] p-3 pl-4 text-[14px] text-[#737373] outline-none focus:border-primary ${
                  displayEmailError ? '!border-red-500' : ''
                }`}
                value={email}
                onChange={handleEmailChange}
                placeholder="Email Address"
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    handleEmailSignIn();
                  }
                }}
              />
              <small className={`${displayEmailError ? 'visible' : 'invisible'}  text-red-500`}>
                Please provide a valid email
              </small>
            </div>

            <Button
              className="hover:bg-[#EEF2FF] hover:text-[#312E81]"
              width="full"
              size="large"
              font="large"
              isLoading={isModifyLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleEmailSignIn();
              }}
            >
              Continue
            </Button>
            {providers && (
              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="mx-4 flex-shrink font-medium text-gray-400">
                  or {signUp ? 'sign up' : 'log in'} using other accounts
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
                      setIsModifyLoading(true);
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
              <h4 className="text-base font-normal text-[#A3A3A3] sm:text-lg">
                {signUp ? 'Already' : "Don't"} have an account?{' '}
                <Link
                  className="font-semibold text-[#4F46E5] hover:underline"
                  href={signUp ? '/auth/login' : '/auth/signup'}
                >
                  {signUp ? 'Sign in' : 'Sign up'}
                </Link>
              </h4>
            </div>
          </section>
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
