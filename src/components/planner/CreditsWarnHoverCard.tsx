import * as HoverCard from '@radix-ui/react-hover-card';
import { FC } from 'react';

interface CreditsWarnHoverCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'top' | 'left' | 'bottom' | 'right';
}

export const CreditsWarnHoverCard: FC<CreditsWarnHoverCardProps> = ({
  open,
  onOpenChange,
  side = 'top',
  children,
}) => (
  <HoverCard.Root open={open} onOpenChange={onOpenChange} openDelay={0}>
    <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        side={side}
        className="z-[9999] w-[250px] animate-[slideUpAndFade_0.3s] rounded-md border border-neutral-200 bg-generic-white p-5 shadow-sm"
        sideOffset={5}
      >
        <h3 className="py-1 text-base font-semibold">
          Credit hours may not count towards full-time student status.
        </h3>
        <HoverCard.Arrow className="fill-primary" />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

export default CreditsWarnHoverCard;
