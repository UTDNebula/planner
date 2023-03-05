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
        className="fixed left-1/2 top-11 z-[999] -translate-x-1/2 transform"
        initial={{ y: -120, x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        exit={{ y: -120 }}
      >
        <div className="flex items-center gap-x-4 overflow-hidden rounded-md border border-neutral-300 bg-generic-white px-5 py-4">
          <Checkbox
            defaultChecked
            style={{ width: '20px', height: '20px' }}
            onClick={deselectAllCourses}
          />

          <span className="text-lg font-semibold text-neutral-900">
            {selectedCount} {selectedCount === 1 ? 'Course' : 'Courses'} Selected
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
