import Modal, { ModalProps } from '@/components/Modal';
import { trpc } from '@/utils/trpc';
import { createNewYear, displaySemesterCode, isSemCodeEqual } from '@/utils/utilFunctions';
import { SemesterCode } from '@prisma/client';
import { FC, useState } from 'react';
import Button from '../../Button';
import SemestersSelect from './SemestersSelect';

export interface EditSemestersModalProps {
  planId: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
  closeModal: () => void;
  open: boolean;
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

  const startSemesterOptions: SemesterCode[] = genSurroundingSemesterCodes(startSemester, 3);
  const endSemesterOptions: SemesterCode[] = genSurroundingSemesterCodes(endSemester, 3);

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
      <div className="mt-4 ml-auto flex w-fit gap-x-4">
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
