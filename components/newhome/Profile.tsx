import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import { useAuthContext } from '../../modules/auth/auth-context';

/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage(): JSX.Element {
  const { user } = useAuthContext();
  return (
    <main className="h-screen w-full flex flex-col overflow-scroll">
      <section className="bg-[#3E61ED] h-40 fixed w-full z-10">
        <Avatar
          alt="Remy Sharp"
          sx={{ width: 120, height: 120, position: 'absolute', bottom: '-60px', left: '20px' }}
        >
          MK
        </Avatar>
      </section>
      <section className="mt-40 flex flex-col gap-y-8 self-center items-center">
        <article className="bg-white">
          <div className="grid grid-cols-2 gap-x-32 gap-y-16 px-6 py-4">
            <div className="font-semibold text-[40px] mb-[-40px]">Profile</div>
            <div></div>
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
          </div>
          <button
            onClick={() => console.log('Hi')}
            className="self-center text-white justify-center items-center w-40 h-12 m-4 flex p-4 bg-[#3E61ED] rounded-2xl"
          >
            Update Profile
          </button>
        </article>
        <article className="bg-white flex flex-col w-full px-6 py-4">
          <div className="font-semibold text-[40px]">Delete My Account</div>
          <div className="text-sm">Deleting your account will remove all user data</div>
          <button
            onClick={() => console.log('Hi')}
            className="text-white justify-center items-center w-20 h-8 flex p-4 bg-[#FF0041] rounded-xl"
          >
            Delete
          </button>
        </article>
      </section>
    </main>
  );
}
