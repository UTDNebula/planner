import Head from 'next/head';
import { useAuthContext } from '../../modules/auth/auth-context';
import { useUserProfileData } from '../../modules/profile/userProfileData';
import CourseAudit from '../../components/home/history/StudentHistoryView/CourseAudit';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';

/**
 * A page containing student attributes and other account settings.
 */
export default function CreditsPage(): JSX.Element {
  return (
    <main className="mx-auto">
      <Head>
        <title>Nebula - Your credits</title>
      </Head>
      <div className="max-w-6xl text-white grid grid-cols-2 px-20 py-10">
        <div className="flex flex-col px-8 space-y-20">
          <div className="text-4xl">Add your credits</div>
          <div className="flex flex-row space-x-4">
            <div className="text-2xl">Type of Credit</div>
            <Select
              labelId="demo-simple-select-autowidth-label"
              label="ap tests"
              id="demo-simple-select-autowidth"
              value={''}
              sx={{
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              className="w-28 rounded-lg h-8"
              variant="standard"
              name="apTest"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="text-2xl">Course</div>
            <Select
              labelId="demo-simple-select-autowidth-label"
              label="ap tests"
              id="demo-simple-select-autowidth"
              value={''}
              sx={{
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              className="w-28 rounded-lg h-8"
              variant="standard"
              name="apTest"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <div className="text-2xl">Score</div>
            <Select
              labelId="demo-simple-select-autowidth-label"
              label="ap tests"
              id="demo-simple-select-autowidth"
              value=""
              sx={{
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              className="w-28 rounded-lg h-8"
              variant="standard"
              name="apTest"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="text-2xl">Course Number</div>
            <Select
              labelId="demo-simple-select-autowidth-label"
              label="ap tests"
              id="demo-simple-select-autowidth"
              value=""
              sx={{
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              className="w-28 rounded-lg h-8"
              variant="standard"
              name="apTest"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="flex flex-row items-center space-x-2 self-end text-2xl">
            <IconButton aria-label="add" size="medium" className="bg-white">
              <AddIcon />
            </IconButton>
            <div>Add Credit</div>
          </div>
        </div>

        <div className="flex flex-col space-y-8 px-8">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl font-bold">Course Credits</div>
              <IconButton
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('HI');
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
            <hr className="text-white" />
            <div className="self-end">heh</div>
            <div className="grid grid-cols-3 gap-x-2 gap-y-5">
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl font-bold">Transfer Credits</div>
              <IconButton
                color="inherit"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('HI');
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
            <hr className="text-white" />
            <div className="self-end">heh</div>
            <div className="grid grid-cols-3 gap-x-2 gap-y-5">
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
              <div className="rounded-xl w-28 h-8 font-semibold bg-white text-black flex justify-center items-center">
                CS 1336
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
