import { TextField, Theme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { makeStyles } from 'tss-react/mui';

import { useAuthContext } from '../../modules/auth/auth-context';

/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage(): JSX.Element {
  const { user } = useAuthContext();
  const useStyles = makeStyles()((theme: Theme) => {
    return {
      container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        height: '100%',
        width: '100%',
        background:
          'linear-gradient(105deg, rgba(245,167,94,0.01) 0%, rgba(255,200,136,0.05) 25%, rgba(222,174,170,0.1) 50%, rgba(135,143,214,0.1) 75%, rgba(98,226,168,0.1) 100%)',
      },
    };
  });

  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <div className="flex justify-center items-center pt-10 px-4">
        <main className="sm:flex sm:flex-col md:grid md:grid-cols-2 md:gap-x-20 md:gap-y-4">
          <div className="font-semibold text-[40px] col-span-full">Profile</div>
          <section className="">
            <article className="flex relative justify-center items-center h-[400px] bg-white mb-10 rounded-2xl">
              <div className="absolute top-8 text-[20px] font-semibold">Gang Gnag</div>
              <Avatar alt="Remy Sharp" variant="square" sx={{ width: 160, height: 160 }}>
                MK
              </Avatar>
            </article>
            <article className="bg-white flex flex-col px-6 py-4 rounded-2xl">
              <div className="font-semibold text-[20px]">Delete My Account</div>
              <div className="text-sm">Deleting your account will remove all user data</div>
              <button
                onClick={() => console.log('Hi')}
                className="text-white justify-center items-center w-20 h-8 flex p-4 bg-[#FF0041] rounded-xl"
              >
                Delete
              </button>
            </article>
          </section>

          <section className=" bg-white flex flex-col gap-y-4 rounded-2xl">
            <article className="">
              <div className="grid grid-cols-2 gap-x-16 gap-y-16 px-6 py-7">
                <div className="font-semibold text-[20px] col-span-full">Update Profile</div>
                <TextField
                  name="name"
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  value={'Hi'}
                  onChange={() => console.log('HI')}
                />
                <TextField
                  name="name"
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  value={'Hi'}
                  onChange={() => console.log('HI')}
                />
                <TextField
                  name="name"
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  value={'Hi'}
                  onChange={() => console.log('HI')}
                />
                <TextField
                  name="name"
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  value={'Hi'}
                  onChange={() => console.log('HI')}
                />
                <TextField
                  name="name"
                  id="outlined-basic"
                  label="Major"
                  variant="outlined"
                  value={'Hi'}
                  onChange={() => console.log('HI')}
                />
                <TextField
                  name="name"
                  id="outlined-basic"
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
          </section>
        </main>
      </div>
    </div>
  );
}
