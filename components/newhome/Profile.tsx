import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { purple } from '@mui/material/colors';

import { useAuthContext } from '../../modules/auth/auth-context';

/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage(): JSX.Element {
  const { user } = useAuthContext();
  return (
    <main className="h-screen w-full flex flex-col overflow-scroll">
      <div className="flex flex-col gap-y-4 self-center items-center">
        <section className="bg-white rounded-2xl">
          <article className="rounded-t-lg relative bg-gradient-to-r from-purple-500 to-blue-500 h-40 w-full z-10">
            <Avatar
              alt="Remy Sharp"
              sx={{
                bgcolor: purple[300],
                width: 120,
                height: 120,
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
              }}
            >
              MK
            </Avatar>
          </article>
          <article className="grid grid-cols-2 gap-x-32 gap-y-16 px-6 py-4">
            <div className="font-semibold text-[40px] mb-[-40px] col-span-full">Profile</div>
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="First Name"
              variant="outlined"
              value={'Hi'}
              onChange={() => console.log('HI')}
            />
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Last Name"
              variant="outlined"
              value={'Hi'}
              onChange={() => console.log('HI')}
            />
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Email"
              variant="outlined"
              value={'Hi'}
              onChange={() => console.log('HI')}
            />
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Password"
              variant="outlined"
              value={'Hi'}
              onChange={() => console.log('HI')}
            />
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Major"
              variant="outlined"
              value={'Hi'}
              onChange={() => console.log('HI')}
            />
            <TextField
              name="name"
              id="outlined-basic"
              className="w-60"
              label="Minor"
              variant="outlined"
              value={'Hi'}
              onChange={() => console.log('HI')}
            />
          </article>
          <button
            onClick={() => console.log('Hi')}
            className="self-center text-white justify-center items-center w-40 h-12 m-4 flex p-4 bg-[#3E61ED] rounded-2xl"
          >
            Update Profile
          </button>
        </section>
        <section className="bg-white flex flex-col w-full px-6 py-4 rounded-2xl">
          <div className="font-semibold text-[40px]">Delete My Account</div>
          <div className="text-sm ">Deleting your account will remove all user data</div>
          <button
            onClick={() => console.log('Hi')}
            className="mt-5 text-white justify-center items-center w-20 h-8 flex p-4 bg-[#FF0041] rounded-xl"
          >
            Delete
          </button>
        </section>
      </div>
    </main>
  );
}
