import { trpc } from '@/utils/trpc';
import { createNewYear, displaySemesterCode, isSemCodeEqual } from '@/utils/utilFunctions';
import { SemesterCode } from '@prisma/client';
import * as Dialog from '@radix-ui/react-dialog';
import { FC, useState } from 'react';
import Button from '../../Button';
import SemestersSelect from './SemestersSelect';

export interface EditSemestersModalProps extends Dialog.DialogProps {
  planId: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
}

// Generates n-year worth of semesters before and after the given semester
const genSurroundingSemesterCodes = (middleSemester: SemesterCode, n: number): SemesterCode[] => {
  return [
    ...new Array(n)
      .fill(0)
      .flatMap((_, i) => createNewYear({ ...middleSemester, year: middleSemester.year - i }))
      .map((semester) => semester.code),
    ...new Array(n)
      .fill(0)
      .flatMap((_, i) => createNewYear({ ...middleSemester, year: middleSemester.year + i }))
      .map((semester) => semester.code),
  ]
    .sort((a, b) => (a.year > b.year ? 1 : -1))
    .filter((semCode) => !isSemCodeEqual(semCode, middleSemester));
};

const EditSemestersModal: FC<EditSemestersModalProps> = ({
  planId,
  startSemester,
  endSemester,
  ...props
}) => {
  const utils = trpc.useContext();
  const modifySemesters = trpc.plan.modifySemesters.useMutation({
    onSuccess: async () => {
      console.log('RUNNNINGGGG');
      await utils.plan.getPlanById.invalidate();
    },
  });

  const [newStartSemester, setNewStartSemester] = useState(startSemester);
  const [newEndSemester, setNewEndSemester] = useState(endSemester);

  const startSemesterOptions: SemesterCode[] = genSurroundingSemesterCodes(startSemester, 3);
  const endSemesterOptions: SemesterCode[] = genSurroundingSemesterCodes(endSemester, 3);

  console.log({ newStartSemester, newEndSemester });

  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Trigger asChild>
          <span>Edit profile</span>
        </Dialog.Trigger>

        <Dialog.Overlay className="fixed inset-0 z-50 bg-generic-black bg-opacity-60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-generic-white p-6">
          <Dialog.Title className="text-lg font-medium">Edit semesters</Dialog.Title>
          <Dialog.Description className="mt-2 text-base text-neutral-400">
            {'WARNING: This will add/delete semesters. This action cannot be undone.'}
          </Dialog.Description>

          <div className="mt-4 flex flex-col gap-y-3">
            <div className="inline-grid grid-cols-[125px_auto] items-center gap-1">
              <label htmlFor="start-semester" className="whitespace-nowrap">
                Start semester
              </label>
              <SemestersSelect
                id="start-semester"
                placeholder={displaySemesterCode(startSemester)}
                semesterCodes={startSemesterOptions}
                onValueChange={(value) => setNewStartSemester(JSON.parse(value))}
              />
            </div>
            <div className="mt-2 inline-grid grid-cols-[125px_auto] items-center gap-1">
              <label htmlFor="end-semester" className="whitespace-nowrap">
                End semester
              </label>
              <SemestersSelect
                id="end-semester"
                placeholder={displaySemesterCode(endSemester)}
                semesterCodes={endSemesterOptions}
                onValueChange={(value) => setNewEndSemester(JSON.parse(value))}
              />
            </div>
          </div>
          <div className="mt-4 ml-auto flex w-fit gap-x-4">
            <Dialog.Close asChild>
              <Button
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={(e) => {
                e.stopPropagation();

                modifySemesters.mutateAsync({
                  planId,
                  newEndSemester,
                  newStartSemester,
                });
              }}
            >
              Save changes
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditSemestersModal;
