import { FC } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';

interface PrereqHoverCardProps {
  prereqs: [Array<string>, Array<string>, Array<string>];
  description: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  isOverriden: boolean;
  title: string;
  side?: 'top' | 'left' | 'bottom' | 'right';
}

export const PrereqWarnHoverCard: FC<PrereqHoverCardProps> = ({
  prereqs,
  open,
  onOpenChange,
  side = 'top',
  title,
  isOverriden,
  children,
}) => (
  <HoverCard.Root open={open} onOpenChange={onOpenChange} openDelay={0}>
    <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        side={side}
        className="z-[9999] h-fit w-[250px] animate-[slideUpAndFade_0.3s] rounded-md border border-neutral-200 bg-generic-white p-5 shadow-sm"
        sideOffset={5}
      >
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {/* {isValid && (
          <span className="text-md mb-2 font-medium">
            All requirements for this course are completed
          </span>
        )} */}
        {!isOverriden && (
          <>
            {prereqs[0].length > 0 && (
              <>
                <h3 className="py-2 text-base font-semibold">Prerequisites not met: </h3>
                <ol className="flex list-disc flex-wrap gap-3">
                  {prereqs[0].map((prereq) => (
                    <li key={prereq} className="ml-4">
                      {prereq}
                    </li>
                  ))}
                </ol>
              </>
            )}
            {prereqs[1].length > 0 && (
              <>
                <h3 className="py-2 text-base font-semibold">Corequisites not met: </h3>
                <ol className="flex list-disc flex-wrap gap-3">
                  {prereqs[1].map((prereq) => (
                    <li key={prereq} className="ml-4">
                      {prereq}
                    </li>
                  ))}
                </ol>
              </>
            )}
            {prereqs[2].length > 0 && (
              <>
                <h3 className="py-2 text-base font-semibold">
                  Corequisites or Prerequisites not met:{' '}
                </h3>
                <ol className="flex list-disc flex-wrap gap-3">
                  {prereqs[2].map((prereq) => (
                    <li key={prereq} className="ml-4">
                      {prereq}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </>
        )}
        {prereqs[0].length > 0 && (
          <>
            <h3 className="py-2 text-base">Prerequisites not met: </h3>
            <ol className="flex list-disc flex-wrap gap-3">
              {prereqs[0].map((prereq) => (
                <li key={prereq} className="ml-4">
                  {prereq}
                </li>
              ))}
            </ol>
          </>
        )}
        {prereqs[1].length > 0 && (
          <>
            <h3 className="py-2 text-base font-semibold">Corequisites not met: </h3>
            <ol className="flex list-disc flex-wrap gap-3">
              {prereqs[1].map((prereq) => (
                <li key={prereq} className="ml-4">
                  {prereq}
                </li>
              ))}
            </ol>
          </>
        )}
        {prereqs[2].length > 0 && (
          <>
            <h3 className="py-2 text-base font-semibold">
              Corequisites or Prerequisites not met:{' '}
            </h3>
            <ol className="flex list-disc flex-wrap gap-3">
              {prereqs[2].map((prereq) => (
                <li key={prereq} className="ml-4">
                  {prereq}
                </li>
              ))}
            </ol>
          </>
        )}
        <HoverCard.Arrow className="fill-primary" />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

export default PrereqWarnHoverCard;
