import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import majorsList from '@data/majors.json';
import EditIcon from '@/icons/EditIcon';
import { trpc } from '@/utils/trpc';
import { toast } from 'react-toastify';

const EditableMajor = ({ major: initialMajor, planId }: { major: string; planId: string }) => {
  const [editMajor, setEditMajor] = useState(false);
  const [major, setMajor] = useState(initialMajor);

  useEffect(() => {
    setMajor(initialMajor);
  }, [initialMajor]);

  return (
    <>
      {!editMajor ? (
        <button
          className="flex items-center gap-x-3 rounded-2xl bg-primary-100 py-2 px-3 tracking-tight"
          onClick={() => setEditMajor(true)}
        >
          <span className="text-lg font-semibold text-primary-800" data-testid="plan-major">
            {major}
          </span>
          <EditIcon className="text-primary-800" />
        </button>
      ) : (
        <div className="flex items-center justify-center ">
          <EditMajorAutocomplete
            major={major}
            setMajor={setMajor}
            setEditMajor={setEditMajor}
            planId={planId}
          />
        </div>
      )}
    </>
  );
};

const EditMajorAutocomplete = ({
  major,
  setMajor,
  setEditMajor,
  planId,
}: {
  major: string;
  setMajor: (major: string) => void;
  setEditMajor: (a: boolean) => void;
  planId: string;
}) => {
  const majors = majorsList as string[];

  const utils = trpc.useContext();

  const updatePlanMajor = trpc.plan.updatePlanMajor.useMutation({
    async onSuccess() {
      await utils.validator.degreeValidator.invalidate();
    },
  });

  const handleSaveMajor = () => {
    setEditMajor(false);

    toast.promise(
      updatePlanMajor.mutateAsync({ major, planId }),
      {
        pending: 'Updating plan major...',
        success: 'Plan major updated!',
        error: 'Error updating plan major',
      },
      {
        autoClose: 1000,
      },
    );
  };

  return (
    <Autocomplete
      disablePortal
      disableClearable
      value={major}
      onChange={(_, value) => setMajor(value)}
      options={majors}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleSaveMajor();
        }
      }}
      onBlur={() => {
        handleSaveMajor();
      }}
      className="flex items-center gap-x-3 rounded-2xl bg-primary-100 px-3"
      sx={{
        width: 350,

        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiAutocomplete-root': {
          padding: '0px',
        },
        '& .MuiOutlinedInput-root': {
          padding: '0px',
        },
        '& .MuiAutocomplete-popupIndicatorOpen': { transform: 'none' },
      }}
      renderInput={(params) => (
        <TextField
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '28px',
              letterSpacing: '-0.025em',
              color: '#3730a3',
            },
            '& .MuiOutlinedInput-root': { fontWeight: 600 },
          }}
          {...params}
        />
      )}
    />
  );
};

export default EditableMajor;
