import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { purple } from '@mui/material/colors';
import { useEffect, useMemo, useState } from 'react';

import { trpc } from '@/utils/trpc';

type ProfilePageProps = {
  isDesktop: boolean;
};
/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage({ isDesktop }: ProfilePageProps): JSX.Element {
  const userQuery = trpc.user.getUser.useQuery();
  const utils = trpc.useContext();

  const { data, isLoading } = userQuery;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [majors, setMajors] = useState<string[]>([]);
  const [minors, setMinors] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setName(data?.profile?.name ?? '');
      setEmail(data?.email ?? '');
      // setMajors(data?.profile?.majors ?? []);
      // setMinors(data?.profile?.minors ?? []);
    }
  }, [data]);

  const updateProfile = trpc.user.updateUserProfile.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const handleSubmit = () => {
    // TODO: Implement changing profile settings here
    updateProfile.mutateAsync({ name });
    return true;
  };

  const handleResetPassword = () => {
    // TODO: Implement resetting password here
    return true;
  };

  // TODO: Refactor this
  const dumbInitialsParser = useMemo(() => {
    return name.split(' ').reduce((prev, curr) => prev + (curr[0] ?? ''), '');
  }, [name]);

  // TODO: In the future replace w/ a standardized loading screen
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mt-4 flex flex-col items-center gap-y-4 self-center">
        <section className="w-full rounded-2xl bg-white">
          <article className="relative z-10 h-40 w-full rounded-t-lg bg-gradient-to-r from-purple-500 to-blue-500">
            <Avatar
              alt="Remy Sharp"
              sx={{
                bgcolor: purple[300],
                width: isDesktop ? 120 : 90,
                height: isDesktop ? 120 : 90,
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
              }}
            >
              {dumbInitialsParser}
            </Avatar>
          </article>
          <article className="grid gap-y-16 px-8 py-4 md:grid-cols-2 md:gap-x-12 lg:gap-x-32">
            <h1 className="col-span-full mb-[-40px]">Profile</h1>
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              inputProps={{ maxLength: 40 }}
            />
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Email"
              variant="outlined"
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Major"
              variant="outlined"
              value={majors.join(', ') || 'None'}
              disabled={true}
              onChange={() => console.log('HI')}
            />
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Minor"
              variant="outlined"
              value={minors.join(', ') || 'None'}
              disabled={true}
              onChange={() => console.log('HI')}
            />
            <button
              onClick={handleSubmit}
              className="col-span-full flex h-12 w-40 items-center justify-center self-center rounded-2xl bg-[#3E61ED] p-4 text-white"
            >
              Update Profile
            </button>
          </article>
        </section>
        <section className="flex w-full flex-col rounded-2xl bg-white px-8 py-4">
          <h1>Reset Password</h1>
          <div className="text-sm ">Click this button to reset your password</div>
          <button
            onClick={handleResetPassword}
            className="mt-5 flex h-8 w-20 items-center justify-center rounded-xl bg-[#3E61ED] p-4 text-white"
          >
            Reset
          </button>
        </section>
        <section className="mb-8 flex w-full flex-col rounded-2xl bg-white px-8 py-4">
          <h1>Delete My Account</h1>
          <div className="text-sm ">Deleting your account will remove all user data</div>
          <button
            disabled={true} // temporary measure for beta
            onClick={() => console.log('Hi')}
            className="mt-5 flex h-8 w-20 items-center justify-center rounded-xl bg-[#FF0041] p-4 text-white disabled:opacity-40"
          >
            Delete
          </button>
        </section>
      </div>
    </main>
  );
}
