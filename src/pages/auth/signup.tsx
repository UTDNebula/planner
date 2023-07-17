import { InferGetServerSidePropsType } from 'next';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import EmojiIcon from '@/icons/EmojiIcon';
import majorsList from '@data/majors.json';

import { useRouter } from 'next/router';
import AuthIcons from '@/icons/AuthIcons';
import Link from 'next/link';
import useSearch from '@/components/search/search';
import { trpc } from '@/utils/trpc';
import Button from '@/components/Button';
import { isValidEmail } from '@/utils/utilFunctions';

// Time elapsed after typing email to display error
const EMAIL_VALIDATION_ERROR_TIMEOUT_MS = 600;

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function AuthPage({
  providers,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  const [email, setEmail] = useState('');
  const [isModifyLoading, setIsModifyLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const displayEmailError = useMemo(() => !isEmailValid && email !== '', [isEmailValid, email]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch courses now & put in cache
  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const majors = majorsList as string[];

  const { results, updateQuery } = useSearch({
    getData: async () => (majors ? majors.map((major) => ({ filMajor: `${major}` })) : []),
    initialQuery: '',
    filterFn: (major, query) => major.filMajor.toLowerCase().includes(query.toLowerCase()),
  });

  // Lets just handle auth redirect on client side
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (router.asPath.includes('OAuthAccountNotLinked')) {
      console.log('yeah so I am actually existing');
    }
    if (router && status === 'authenticated') {
      router.push('/app/home');
    }
  }, [router, status]);

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
      <section>
        <div className="w-auto">
          <div className="flex flex-wrap">
            {EmojiIcon['sparkle']}
            <h1 className="-mt-2 ml-2 text-3xl text-[36px] font-bold leading-normal tracking-tight">
              Create An Account
            </h1>
          </div>
          <p className="text-[16px] text-sm font-medium leading-normal text-[#737373]">
            Welcome to Nebula Planner! To get started, please sign up below.
          </p>
          <section className="mt-7 space-y-5">
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
                  or sign up using other accounts
                </span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
            )}
            <div className="flex w-full appearance-none items-center justify-center rounded-lg pb-4">
              {providers &&
                Object.values(providers).map((provider, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: '/app/home',
                      })
                    }
                    className={`-ml-2 h-10 rounded-full px-3 text-gray-200 `}
                  >
                    {AuthIcons[provider.id]}
                  </button>
                ))}
            </div>
            <div className="flex place-content-center">
              <h4 className="text-lg font-normal text-[#A3A3A3]">
                Already have an account?{' '}
                <Link className="font-semibold text-[#4F46E5] hover:underline" href="/auth/login">
                  Sign In
                </Link>
              </h4>
            </div>
          </section>
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
