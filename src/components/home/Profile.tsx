import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { purple } from '@mui/material/colors';
import { useEffect, useMemo, useState } from 'react';
import { trpc } from '@/utils/trpc';
import {
  createSemesterCodeRange,
  displaySemesterCode,
  generateSemesters,
} from '@/utils/utilFunctions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getStartingPlanSemester } from '@/utils/plannerUtils';

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

  const user = trpc.user.getUser.useQuery();
  const semesters = useMemo(
    () =>
      createSemesterCodeRange(
        user.data?.profile?.startSemester ?? { semester: 'f', year: 2022 },
        getStartingPlanSemester(),
        true,
      ),
    [],
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [firstSem, setFirstSem] = useState('');
  const [firstYear, setFirstYear] = useState('');
  const [secondSem, setSecondSem] = useState('');
  const [secondYear, setSecondYear] = useState('');

  useEffect(() => {
    if (!isLoading) {
      setName(data?.profile?.name ?? '');
      setEmail(data?.email ?? '');
      setFirstSem(
        displaySemesterCode(data?.profile?.startSemester ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[0],
      );
      setFirstYear(
        displaySemesterCode(data?.profile?.startSemester ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[1],
      );
      setSecondSem(
        displaySemesterCode(data?.profile?.endSemester ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[0],
      );
      setSecondYear(
        displaySemesterCode(data?.profile?.endSemester ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[1],
      );
    }
  }, [data]);

  const updateProfile = trpc.user.updateUserProfile.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const handleSubmit = () => {
    type semesterChars = 'f' | 'u' | 's';
    let firstSemester!: semesterChars;

    switch (firstSem) {
      case 'Fall':
        firstSemester = 'f';
        break;
      case 'Spring':
        firstSemester = 's';
        break;
      case 'Summer':
        firstSemester = 'u';
        break;
    }
    let secondSemester!: semesterChars;
    switch (secondSem) {
      case 'Fall':
        secondSemester = 'f';
        break;
      case 'Spring':
        secondSemester = 's';
        break;
      case 'Summer':
        secondSemester = 'u';
        break;
    }
    updateProfile.mutateAsync({
      name: name,
      startSemester: { semester: firstSemester, year: Number(firstYear) },
      endSemester: { semester: secondSemester, year: Number(secondYear) },
    });
    return true;
  };

  const handleFirstSemesterChange = (event: SelectChangeEvent) => {
    setFirstSem(event.target.value);
    return true;
  };

  const handleFirstSemesterChangeYear = (event: SelectChangeEvent) => {
    setFirstYear(event.target.value);
    return true;
  };
  const handleSecondSemesterChange = (event: SelectChangeEvent) => {
    setSecondSem(event.target.value);
    return true;
  };

  const handleSecondSemesterChangeYear = (event: SelectChangeEvent) => {
    setSecondYear(event.target.value);
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
            <article className="grid gap-y-0 px-0 py-0 md:auto-rows-min md:grid-cols-1 md:gap-x-10 lg:gap-x-0">
              <h2 className="col-span-full mb-[10px] ml-[5px]">Start Semester</h2>
              <article className="grid gap-y-0 px-0 py-0 md:grid-cols-2 md:gap-x-10 lg:gap-x-0">
                <FormControl sx={{ m: 0.5, width: 113 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Sem</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={firstSem}
                    onChange={handleFirstSemesterChange}
                    autoWidth
                    label="Age"
                  >
                    <MenuItem value="Fall">Fall</MenuItem>
                    <MenuItem value="Summer">Summer</MenuItem>
                    <MenuItem value="Spring">Spring</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 0.5, width: 113 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Year</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={firstYear}
                    onChange={handleFirstSemesterChangeYear}
                    autoWidth
                    label="Age"
                  >
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                    <MenuItem value="2027">2027</MenuItem>
                    <MenuItem value="2028">2028</MenuItem>
                    <MenuItem value="2029">2029</MenuItem>
                    <MenuItem value="2030">2030</MenuItem>
                  </Select>
                </FormControl>
              </article>
            </article>
            <article className="grid gap-y-0 px-0 py-0 md:auto-rows-min md:grid-cols-1 md:gap-x-10 lg:gap-x-0">
              <h2 className="col-span-full mb-[10px] ml-[5px]">End Semester</h2>
              <article className="grid gap-y-0 px-0 py-0 md:grid-cols-2 md:gap-x-10 lg:gap-x-0">
                <FormControl sx={{ m: 0.5, width: 113 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Sem</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={secondSem}
                    onChange={handleSecondSemesterChange}
                    autoWidth
                    label="Age"
                  >
                    <MenuItem value="Fall">Fall</MenuItem>
                    <MenuItem value="Summer">Summer</MenuItem>
                    <MenuItem value="Spring">Spring</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 0.5, width: 113 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Year</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={secondYear}
                    onChange={handleSecondSemesterChangeYear}
                    autoWidth
                    label="Age"
                  >
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                    <MenuItem value="2027">2027</MenuItem>
                    <MenuItem value="2028">2028</MenuItem>
                    <MenuItem value="2029">2029</MenuItem>
                    <MenuItem value="2030">2030</MenuItem>
                  </Select>
                </FormControl>
              </article>
            </article>
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
