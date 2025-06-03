import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { purple } from '@mui/material/colors';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { signOut } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { trpc } from '@/utils/trpc';
import { displaySemesterCode } from '@/utils/utilFunctions';

import Button from '../Button';

type ProfilePageProps = {
  isDesktop: boolean;
};
/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage({ isDesktop }: ProfilePageProps): JSX.Element {
  const userQuery = trpc.user.getUser.useQuery();
  const utils = trpc.useContext();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteUser = trpc.user.deleteUser.useMutation({
    onSettled: () => setDeleteLoading(false),
    onSuccess: async () => {
      utils.user.getUser.invalidate();
      signOut();
    },
  });

  const { data, isLoading } = userQuery;

  const [updateLoading, setUpdateLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [firstSem, setFirstSem] = useState('');
  const [firstYear, setFirstYear] = useState('');
  const [secondSem, setSecondSem] = useState('');
  const [secondYear, setSecondYear] = useState('');

  const [boxOneHandler, setBoxOneHandler] = useState('');
  const [boxTwoHandler, setBoxTwoHandler] = useState('');
  const [boxTwoHandlerText, setBoxTwoHandlerText] = useState('');

  useEffect(() => {
    if (!isLoading) {
      setName(data?.profile?.name ?? '');
      setEmail(data?.email ?? '');

      setFirstSem(
        displaySemesterCode(data?.profile?.startSemesterCode ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[0],
      );
      setFirstYear(
        displaySemesterCode(data?.profile?.startSemesterCode ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[1],
      );
      setSecondSem(
        displaySemesterCode(data?.profile?.endSemesterCode ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[0],
      );
      setSecondYear(
        displaySemesterCode(data?.profile?.endSemesterCode ?? { semester: 'f', year: 404 }).split(
          ' ',
        )[1],
      );
    }
  }, [data]);

  const updateProfile = trpc.user.updateUserProfile.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
      setUpdateLoading(false);
    },
  });

  const handleSubmit = () => {
    if (boxTwoHandler == 'red') {
      return false;
    }

    setUpdateLoading(true);
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
    toast.promise(
      updateProfile.mutateAsync({
        name: name,
        startSemester: { semester: firstSemester, year: Number(firstYear) },
        endSemester: { semester: secondSemester, year: Number(secondYear) },
      }),
      {
        pending: 'Updating profile...',
        success: 'Profile updated!',
        error: 'Error creating profile',
      },
      {
        autoClose: 1000,
      },
    );
    setBoxOneHandler('lightgreen');
    setBoxTwoHandler('lightgreen');
    setBoxTwoHandlerText('');
  };

  const checkSemesterValidity = (
    firSem: string,
    firYear: string,
    secSem: string,
    secYear: string,
  ) => {
    if (
      (parseInt(firYear) == parseInt(secYear) &&
        ((firSem == 'Summer' && secSem == 'Spring') || (firSem == 'Fall' && secSem != 'Fall'))) ||
      parseInt(firYear) > parseInt(secYear)
    ) {
      setBoxTwoHandler('red');
      setBoxTwoHandlerText('End semester is before start semester');
    } else {
      setBoxTwoHandler('primary');
      setBoxTwoHandlerText('');
    }
    setBoxOneHandler('primary');
  };

  const handleFirstSemesterChange = (event: SelectChangeEvent) => {
    checkSemesterValidity(event.target.value, firstYear, secondSem, secondYear);
    setFirstSem(event.target.value);
    return true;
  };

  const handleFirstSemesterChangeYear = (event: SelectChangeEvent) => {
    checkSemesterValidity(firstSem, event.target.value, secondSem, secondYear);
    setFirstYear(event.target.value);
    return true;
  };
  const handleSecondSemesterChange = (event: SelectChangeEvent) => {
    checkSemesterValidity(firstSem, firstYear, event.target.value, secondYear);
    setSecondSem(event.target.value);
    return true;
  };

  const handleSecondSemesterChangeYear = (event: SelectChangeEvent) => {
    checkSemesterValidity(firstSem, firstYear, secondSem, event.target.value);
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
          <article className="relative z-10 h-40 w-full rounded-t-lg bg-linear-to-r from-purple-500 to-blue-500">
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
                    sx={{
                      '&.MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: boxOneHandler,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: boxOneHandler,
                        },
                      },
                    }}
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
                    sx={{
                      '&.MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: boxOneHandler,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: boxOneHandler,
                        },
                      },
                    }}
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
                    sx={{
                      '&.MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: boxTwoHandler,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: boxTwoHandler,
                        },
                      },
                    }}
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
                    sx={{
                      '&.MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: boxTwoHandler,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: boxTwoHandler,
                        },
                      },
                    }}
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
              <FormHelperText sx={{ color: 'red' }}> {boxTwoHandlerText} </FormHelperText>
            </article>
            <Button onClick={handleSubmit} isLoading={updateLoading}>
              Update Profile
            </Button>
          </article>
        </section>
        <section className="mb-8 flex w-full flex-col rounded-2xl bg-white px-8 py-4">
          <h1>Delete My Account</h1>
          <div className="text-sm ">Deleting your account will remove all user data</div>
          <Button
            isLoading={deleteLoading}
            className="mt-5"
            onClick={() => {
              setDeleteLoading(true);
              deleteUser.mutateAsync();
            }}
          >
            Delete
          </Button>
        </section>
      </div>
    </main>
  );
}
