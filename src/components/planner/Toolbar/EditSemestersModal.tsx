import { FC, useState } from 'react';

import { SemesterCode } from '@/../prisma/utils';
import Modal from '@/components/Modal';
import { trpc } from '@/utils/trpc';
import { displaySemesterCode, generateSemesters } from '@/utils/utilFunctions';

import SemestersSelect from './SemestersSelect';
import Button from '../../Button';

export interface EditSemestersModalProps {
  planId: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
  closeModal: () => void;
  open: boolean;
}

// Generates n-year worth of semesters before and after the given semester
const genSurroundingSemesterCodes = (middleSemester: SemesterCode, n: number): SemesterCode[] => {
  return generateSemesters(n, middleSemester.year - n / (2 * 3), 'f', true).map((sem) => sem.code);
};

const EditSemestersModal: FC<EditSemestersModalProps> = ({
  planId,
  startSemester,
  endSemester,
  closeModal,
  ...props
}) => {
  const utils = trpc.useContext();
  const [isModifyLoading, setIsModifyLoading] = useState(false);
  const modifySemesters = trpc.plan.modifySemesters.useMutation({
    onSuccess: async () => {
      await utils.plan.getPlanById.invalidate();
      closeModal();
    },
    onSettled: async () => setIsModifyLoading(false),
  });

  const [newStartSemester, setNewStartSemester] = useState(startSemester);
  const [newEndSemester, setNewEndSemester] = useState(endSemester);

  const startSemesterOptions: SemesterCode[] = genSurroundingSemesterCodes(startSemester, 12);
  const endSemesterOptions: SemesterCode[] = genSurroundingSemesterCodes(endSemester, 12);

  return (
    <Modal onClose={closeModal} {...props}>
      <h1 className="text-lg font-medium">Edit semesters</h1>
      <p className="mt-2 text-base text-neutral-400">
        {'WARNING: This will add/delete semesters. This action cannot be undone.'}
      </p>

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
      <div className="ml-auto mt-4 flex w-fit gap-x-4">
        <Button
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
        >
          Cancel
        </Button>
        <Button
          isLoading={isModifyLoading}
          onClick={(e) => {
            e.stopPropagation();
            setIsModifyLoading(true);
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
    </Modal>
  );
};

export default EditSemestersModal;
