import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import React from 'react';

import { DragDataToSidebarTile } from '../types';

export interface DeleteCourseDropProps {
  dropId: UniqueIdentifier;
}

export default function DeleteCourseDrop({ dropId }: DeleteCourseDropProps) {
  const { setNodeRef } = useDroppable({
    id: dropId,
    data: { to: 'sidebar-tile' } as DragDataToSidebarTile,
  });

  return (
    <div
      ref={setNodeRef}
      id="tutorial-editor-1"
      className="z-0 h-screen w-[30%] min-w-[30%] overflow-x-hidden overflow-y-scroll"
    >
      <div className="flex h-fit min-h-screen w-full flex-col gap-y-4 bg-white p-4">
        <div className="flex h-[96vh] flex-[1_0_0] flex-col items-center justify-center self-stretch rounded-3xl border-2 border-dashed border-[color:var(--destructive-500-main,#EF4444)]">
          <div className="self-stretch text-center text-base font-semibold not-italic leading-6 text-[color:var(--neutral-400,#A3A3A3)]">
            Drag course here to delete
          </div>
        </div>
      </div>
    </div>
  );
}
