import { PropsWithChildren } from 'react';
import Button from '../Button';
import CloseIcon from '@mui/icons-material/Close';
import { PageProps } from './CustomPlan';

export function Page({ title, subtitle, children, actions, close }: PropsWithChildren<PageProps>) {
  return (
    <section className="flex flex-col justify-center gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-neutral-500">{subtitle}</p>
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
        {actions.map(({ name, onClick, color, loading }, index) => (
          <Button color={color} onClick={onClick} key={index} isLoading={loading}>
            {name}
          </Button>
        ))}
      </div>
    </section>
  );
}
