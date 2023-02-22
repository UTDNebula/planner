import CursorClickIcon from '@/icons/CursorClickIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';
import Button from '../Button';
import Checkbox from '../Checkbox';

export interface SelectedCoursesToastProps {
  show: boolean;
  selectedCount: number;
  deselectAllCourses: () => void;
  deleteSelectedCourses: () => void;
  selectAllCourses: () => void;
  areAllCoursesSelected: boolean;
}

const SelectedCoursesToast: FC<SelectedCoursesToastProps> = ({
  show,
  selectedCount,
  deleteSelectedCourses,
  deselectAllCourses,
  selectAllCourses,
  areAllCoursesSelected,
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="fixed top-11 left-1/2 -translate-x-1/2 transform"
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        exit={{ y: -120 }}
      >
        <div className="flex items-center gap-x-4 overflow-hidden rounded-md border border-neutral-300 bg-generic-white px-5 py-4">
          <Checkbox
            defaultChecked
            style={{ width: '20px', height: '20px' }}
            onClick={deselectAllCourses}
          />

          <span className="text-lg font-semibold text-neutral-900">
            {selectedCount} Courses Selected
          </span>

          <Button
            size="medium"
            color="secondary"
            icon={<DeleteIcon />}
            onClick={deleteSelectedCourses}
          >
            Delete
          </Button>

          <Button
            size="medium"
            color="primary"
            icon={<CursorClickIcon stroke="#fff" />}
            onClick={areAllCoursesSelected ? deselectAllCourses : selectAllCourses}
          >
            {areAllCoursesSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SelectedCoursesToast;
