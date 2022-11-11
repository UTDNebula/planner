import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { StudentPlan } from '../../../modules/common/data';
import { updatePlan } from '../../../modules/redux/userDataSlice';

export type PlanCardProps = {
  id: string;
  plan: StudentPlan;
};

export default function PlanCard({ id, plan }: PlanCardProps) {
  const { title, major } = plan;

  const dispatch = useDispatch();

  const anchor = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    if (!anchor.current) return;
    setOpen(true);
  };
  const handleClose: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    if (!anchor.current) return;
    setOpen(false);
  };

  const handleDuplicate = () => {
    const newPlanFromTemplate: StudentPlan = {
      ...plan,
      id: uuid(),
      title: `Copy of ${plan.title}`,
    };
    dispatch(updatePlan(newPlanFromTemplate));
    setOpen(false);
  };
  return (
    <Tooltip
      title={title}
      componentsProps={{
        tooltip: {
          className: 'p-5 text-[16px] bg-white text-defaultText border-2  rounded-xl',
        },
      }}
      followCursor
      placement="top-start"
    >
      <>
        <Menu
          id={'dropdown-' + id}
          MenuListProps={{
            'aria-labelledby': 'dropdown-button-' + id,
          }}
          anchorEl={anchor?.current}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
        </Menu>
        <Link href={`/app/plans/${id}`}>
          <div className="bg-white max-w-[300px] h-[150px] w-full text-left py-6 flex flex-col px-8 rounded-2xl shadow-2xl transition-all hover:scale-11 cursor-pointer">
            <div className="flex items-center justify-between">
              <h4 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap h-min">
                {title}
              </h4>
              <IconButton
                aria-label="more"
                ref={anchor}
                id={'dropdown-button-' + id}
                aria-controls={open ? 'dropdown-' + id : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
            <p>{major}</p>
          </div>
        </Link>
      </>
    </Tooltip>
  );
}
