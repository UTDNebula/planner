import * as HoverCard from '@radix-ui/react-hover-card';
import Link from 'next/link';
import { FC, useState } from 'react';

interface CourseInfoHoverCardProps {
  // prereqs: string[][];
  description: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'left' | 'bottom' | 'right';
  title: string;
  courseCode: string;
  year: number;
}

export const CourseInfoHoverCard: FC<CourseInfoHoverCardProps> = ({
  description,
  open,
  onOpenChange,
  side = 'bottom',
  title,
  courseCode,
  year,
  children,
}) => (
  <HoverCard.Root open={open} onOpenChange={onOpenChange}>
    <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        onClick={(e) => e.stopPropagation()}
        side={side}
        className="z-[999] w-[300px] animate-[slideUpAndFade_0.3s] rounded-md border border-neutral-200 bg-generic-white p-6 shadow-sm"
        sideOffset={5}
      >
        <h3 className="mb-2 text-base font-semibold">
          <Link
            href={`https://catalog.utdallas.edu/${year}/undergraduate/courses/${courseCode
              .replace(' ', '')
              .toLowerCase()}`}
            target="_blank"
            className="underline"
          >
            {title}
          </Link>
        </h3>
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
  const boldDescription = description.replaceAll(/(\b[A-Z]{2,4} \d{4}\b)/gi, '<b>$1</b>');
  return (
    <span>
      <p className="text-xs">
        <span
          dangerouslySetInnerHTML={{
            __html: !showMore ? boldDescription.substring(0, 200) + '...' : boldDescription,
          }}
        />{' '}
        <button
          className={`${showMore ? '' : 'inline'} font-medium text-primary`}
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
