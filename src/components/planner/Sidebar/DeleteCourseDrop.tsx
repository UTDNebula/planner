import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';

import { DragDataToSidebarTile } from '../types';

export interface DeleteCourseDropProps {
  dropId: UniqueIdentifier;
  open: boolean;
}

export default function DeleteCourseDrop({ dropId, open }: DeleteCourseDropProps) {
  const { setNodeRef } = useDroppable({
    id: dropId,
    data: { to: 'sidebar-tile' } as DragDataToSidebarTile,
  });

  if (open) {
    return (
      <div
        ref={setNodeRef}
        id="tutorial-editor-1"
        className="z-0 h-screen w-[30%] min-w-[30%] overflow-x-hidden overflow-y-scroll"
      >
        <div className="flex h-fit min-h-screen w-full flex-col gap-y-4 bg-white p-4">
          <div className="h-[96vh] rounded-lg border-2 border-dashed border-red-400">
            <div className="flex h-screen items-center justify-center">
              Drop here to delete course
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        ref={setNodeRef}
        className="z-0 flex h-screen w-[50px] flex-col items-center border border-neutral-300 bg-red-500 py-8"
      ></div>
    );
  }
}
