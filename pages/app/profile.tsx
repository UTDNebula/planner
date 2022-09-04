import Head from 'next/head';
import { useAuthContext } from '../../modules/auth/auth-context';
import { useUserProfileData } from '../../modules/profile/userProfileData';
import CourseAudit from '../../components/home/history/StudentHistoryView/CourseAudit';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';

/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage(): JSX.Element {
  const { user } = useAuthContext();
  const { userInfo } = useUserProfileData(user.id);
  return (
    <main className="mx-auto">
      <Head>
        <title>Nebula - Your profile</title>
      </Head>
      <div className="max-w-6xl text-white grid grid-cols-2 px-20 py-10">
        <div className="flex flex-col items-start px-8 space-y-16">
          <div className="flex flex-row justify-center items-center">
            <Avatar sx={{ width: 100, height: 100 }}>H</Avatar>
            <div className="flex flex-col pl-6">
              <div className="flex flex-row items-center">
                <span className="text-2xl">Student Name</span>
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
              <div className="text-xl">Email</div>
            </div>
          </div>
          <div className="">
            <div className="text-lg">
              Do you give permission for Nebula to collect your user data and usage patterns for
              research purposes?
            </div>
            <Switch color="secondary" />
          </div>
          <div className="flex flex-col items-start ">
            <div className="text-2xl">Delete My Account</div>
            <div>Deleting your account will remove all user data.</div>
            <button className="rounded-xl bg-white text-black flex px-2 mt-2 text-sm">
              Click Here to Delete
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-8 px-8">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl">Major</div>
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
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl">Minor</div>
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
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl">Honors</div>
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
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl">Fast Track</div>
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
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl">Post-graduation Plan</div>
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
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="text-2xl">Grants</div>
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
          </div>
        </div>
      </div>
    </main>
  );
}
