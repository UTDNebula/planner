import { UniqueIdentifier } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { ObjectID } from 'bson';
import React from 'react';
import { DragDataFromCourseList } from '../types';
import { CSS } from '@dnd-kit/utilities';

export default function PlaceholderComponent({
  requirement,
  handlePlaceholderCancel,
  handlePlaceholderSubmit,
}: {
  requirement: string;
  handlePlaceholderCancel: () => void;
  handlePlaceholderSubmit: () => void;
}) {
  return (
    <>
      <Hi requirement={requirement} />
      <div className="flex flex-row justify-between gap-x-4 text-[10px] text-[#3E61ED]">
        <button onClick={handlePlaceholderCancel}>CANCEL</button>
        <button onClick={handlePlaceholderSubmit}>DONE</button>
      </div>
    </>
  );
}

const Hi = ({ requirement }: { requirement: string }) => {
  const [placeholderName, setPlaceholderName] = React.useState<string>('');
  const [placeholderHours, setPlaceholderHours] = React.useState<number>(0);
  const id = new ObjectID();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'placeholder',
    data: {
      from: 'course-list',
      course: { id, code: placeholderName, bypass: { requirement, hours: placeholderHours } },
    } as DragDataFromCourseList,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className="flex flex-row items-center justify-between gap-x-4 rounded-md border border-[#EDEFF7] bg-white py-1.5 px-2 text-[10px] drop-shadow-sm"
    >
      <input
        value={placeholderName}
        placeholder="Add Placeholder Name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaceholderName(e.target.value)}
      ></input>
      <input
        value={placeholderHours || undefined}
        className="flex w-20"
        placeholder="Add # hours"
        inputMode="numeric"
        onChange={(e) => setPlaceholderHours(parseInt(e.target.value))}
      />
    </div>
  );
};
