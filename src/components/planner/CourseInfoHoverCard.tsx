import { FC, useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';

interface CourseInfoHoverCardProps {
  // prereqs: string[][];
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'top' | 'left' | 'bottom' | 'right';
  title: string;
}

export const CourseInfoHoverCard: FC<CourseInfoHoverCardProps> = ({
  // prereqs,
  description,
  open,
  onOpenChange,
  side = 'bottom',
  title,
  children,
}) => (
  <HoverCard.Root open={open} onOpenChange={onOpenChange}>
    <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        onClick={(e) => e.stopPropagation()}
        side={side}
        className="z-[999] w-[350px] animate-[slideUpAndFade_0.3s] rounded-md border border-neutral-200 bg-generic-white p-5 shadow-sm"
        sideOffset={5}
      >
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <CourseDescription description={description} />

        <HoverCard.Arrow className="fill-primary" />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

export default CourseInfoHoverCard;

/**
 * This component shows a course description.
 * It also adds "Show more" or "Show less" button
 * since course descriptions tend to be very long
 */
const CourseDescription = ({ description }: { description: string }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <span>
      <p className="text-sm">
        {!showMore ? `${description.substring(0, 200)}...` : description}
        <button
          className="inline pl-2 font-medium text-primary"
          onClick={(e) => {
            setShowMore(!showMore);
          }}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </p>
    </span>
  );
};
