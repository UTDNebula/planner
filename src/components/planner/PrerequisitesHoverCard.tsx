import { FC } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';

interface PrerequisitesHoverCardProps {
  prereqs: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'top' | 'left' | 'bottom' | 'right';
}

export const PrerequisitesHoverCard: FC<PrerequisitesHoverCardProps> = ({
  prereqs,
  open,
  onOpenChange,
  side = 'bottom',
  children,
}) => (
  <HoverCard.Root open={open} onOpenChange={onOpenChange}>
    <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        side={side}
        className="w-[250px] animate-[slideUpAndFade_0.3s] rounded-md border border-neutral-200 bg-generic-white p-5 shadow-sm"
        sideOffset={5}
      >
        <h3 className="mb-2 text-lg font-semibold">Prerequisites</h3>
        {prereqs.length > 0 ? (
          <ol className="flex list-disc flex-wrap gap-3">
            {prereqs.map((prereq) => (
              <li key={prereq} className="ml-4">
                {prereq}
              </li>
            ))}
          </ol>
        ) : (
          <span>None</span>
        )}
        <HoverCard.Arrow fill="black" />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

export default PrerequisitesHoverCard;
