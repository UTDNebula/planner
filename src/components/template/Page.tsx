import CloseIcon from '@mui/icons-material/Close';
import { PropsWithChildren } from 'react';

import { PageProps } from './CustomPlan';
import Button from '../Button';

export function Page({
  title,
  subtitle,
  children,
  actions,
  close,
  ...props
}: PropsWithChildren<PageProps>) {
  return (
    <section className="flex flex-col justify-center gap-4" {...props}>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="text-[14px] leading-6 text-neutral-500">
            {subtitle}
            {title === 'Upload Transcript' && (
              <span>
                {' Download it '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://registrar.utdallas.edu/transcript/unofficial/"
                  className="text-primary underline"
                >
                  here
                </a>
              </span>
            )}
          </p>
          <p className="text-sm text-neutral-500"></p>
        </div>
        <button
          onClick={close}
          className="h-min w-min p-2 text-neutral-500 transition-colors hover:text-neutral-700"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
      <div className="flex gap-6 place-self-end font-medium">
        {actions.map(({ name, onClick, color, loading, disabled, ...props }, index) => (
          <Button
            color={color}
            onClick={onClick}
            key={index}
            isLoading={loading}
            disabled={disabled}
            {...props}
          >
            {name}
          </Button>
        ))}
      </div>
    </section>
  );
}
