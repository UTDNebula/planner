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
      setMajors(data?.profile?.majors ?? []);
      setMinors(data?.profile?.minors ?? []);
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
    <main className="h-full w-full flex flex-col overflow-y-auto">
      <div className="flex flex-col gap-y-4 mt-4 self-center items-center">
        <section className="bg-white rounded-2xl w-full">
          <article className="rounded-t-lg relative bg-gradient-to-r from-purple-500 to-blue-500 h-40 w-full z-10">
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
          <article className="grid md:grid-cols-2 md:gap-x-12 lg:gap-x-32 gap-y-16 px-8 py-4">
            <h1 className="mb-[-40px] col-span-full">Profile</h1>
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
              className="col-span-full self-center text-white justify-center items-center w-40 h-12 flex p-4 bg-[#3E61ED] rounded-2xl"
            >
              Update Profile
            </button>
          </article>
        </section>
        <section className="bg-white flex flex-col w-full px-8 py-4 rounded-2xl">
          <h1>Reset Password</h1>
          <div className="text-sm ">Click this button to reset your password</div>
          <button
            onClick={handleResetPassword}
            className="mt-5 text-white justify-center items-center w-20 h-8 flex p-4 bg-[#3E61ED] rounded-xl"
          >
            Reset
          </button>
        </section>
        <section className="bg-white flex flex-col w-full px-8 py-4 rounded-2xl mb-8">
          <h1>Delete My Account</h1>
          <div className="text-sm ">Deleting your account will remove all user data</div>
          <button
            disabled={true} // temporary measure for beta
            onClick={() => console.log('Hi')}
            className="mt-5 text-white justify-center items-center w-20 h-8 flex p-4 bg-[#FF0041] disabled:opacity-40 rounded-xl"
          >
            Delete
          </button>
        </section>
      </div>
    </main>
  );
}
