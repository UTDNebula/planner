import AddFileIcon from '@/icons/AddFileIcon';
import DownloadIcon from '@/icons/DownloadIcon';
import EditIcon from '@/icons/EditIcon';
import { FC } from 'react';
import Button from '../Button';
import Toggle from '../Toggle';

export interface ToolbarProps {
  title: string;
  major: string;
}

const Toolbar: FC<ToolbarProps> = ({ title, major }) => {
  return (
    <section className="flex w-full flex-col justify-center gap-y-6">
      <article className="flex justify-between">
        <h1 className="text-[36px] font-semibold text-primary-900">{title}</h1>
        <div className="flex gap-3">
          <Button size="large" icon={<AddFileIcon className="h-6 w-5" />} />
          <Button size="large" icon={<DownloadIcon />}>
            Export Degree Plan
          </Button>
        </div>
      </article>

      <article className="flex justify-between">
        <button className="flex items-center gap-x-3 rounded-2xl bg-primary-100 p-3">
          <span className="text-xl font-semibold text-primary-800">{major}</span>
          <EditIcon className="text-primary-800" />
        </button>

        <form className="flex items-center gap-x-3">
          <Toggle size="small" id="transfer-toggle" />
          <label htmlFor="transfer-toggle" className="text-base text-neutral-900">
            Show Transfer Credits
          </label>
        </form>
      </article>
    </section>
  );
};

export default Toolbar;
