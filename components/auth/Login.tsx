import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useAuthContext } from '../../modules/auth/auth-context';
import logo from '../../public/Nebula_Planner_Logo.png';

/**
 * A dialog that exposes different sign-in/sign-up methods.
 */
export default function AuthCard(): JSX.Element {
  const { signInWithEmail, signInWithGoogle } = useAuthContext();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleEmailSignIn = () => {
    signInWithEmail(email, password);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignInWithGoogle = () => {
    signInWithGoogle();
  };

  return (
    <div className="bg-white md:shadow-lg shadow-none rounded p-6 w-96 ">
      <div className="mb-4 flex justify-center items-center">
        <Image src={logo} alt="Logo" width="120px" height="120px" className="rounded-full" />
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
          ></input>
        </div>
        <div className="mb-4 relative">
          <input
            type="password"
            className="w-full border border-black p-3 rounded outline-none focus:border-black"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          ></input>
        </div>
        <div className="">
          <Link href="/auth/reset">
            <a className="font-semibold text-blue-700 hover:bg-blue-100 rounded-lg">
              Forgot password?
            </a>
          </Link>
        </div>
        <button
          onClick={handleEmailSignIn}
          className="w-full text-center bg-blue-700 hover:bg-blue-800 rounded-lg text-white py-3 font-medium"
        >
          Sign in
        </button>
        <div className="items-center mx-auto -mb-6 pb-1">
          <h1 className="text-center text-s text-gray-700">or</h1>
        </div>
        <button
          onClick={handleSignInWithGoogle}
          className="appearance-none items-center justify-center block w-full bg-gray-100 text-gray-700 shadow border border-gray-500 rounded-lg py-3 px-3 leading-tight hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
        >
          <h1 className="text-center text-xl text-blue-700">Sign in with Google</h1>
        </button>
        <div className="flex place-content-center">
          <p>
            New to Nebula?
            <Link href="/auth/signup">
              <a className="ml-2 text-blue-700 font-semibold hover:bg-blue-200 hover:rounded-lg">
                Sign Up
              </a>
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
