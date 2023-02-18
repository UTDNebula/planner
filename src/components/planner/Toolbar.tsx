import AddFileIcon from '@/icons/AddFileIcon';
import DownloadIcon from '@/icons/DownloadIcon';
import { FC } from 'react';
import Button from '../Button';

export interface ToolbarProps {
  title: string;
}

const Toolbar: FC<ToolbarProps> = ({ title }) => {
  return (
    <section className="flex w-full flex-col justify-center">
      <article className="flex justify-between">
        <h1 className="text-[36px] font-semibold text-primary-900">{title}</h1>
        <div className="flex gap-3">
          <Button size="large" icon={<AddFileIcon className="h-6 w-5" />} />
          <Button size="large" icon={<DownloadIcon />}>
            Export Degree Plan
          </Button>
        </div>
      </article>
    </section>
  );
};

export default Toolbar;
