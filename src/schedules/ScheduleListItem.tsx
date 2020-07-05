import React from 'react';
import {
  ListItem,
  ListItemText,
  Popover,
  makeStyles,
  createStyles,
  Theme,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';
import { Schedule } from '../store/user/types';

/**
 * A callback for schedule item selections.
 */
export type ScheduleSelectionCallback = (scheduleId: string) => void;

/**
 * A callback for to trigger a schedule deletion.
 */
export type ScheduleDeletionCallback = ScheduleSelectionCallback;

/**
 * Component properties for a {@link ScheduleListItem}.
 */
interface ScheduleListItemProps {
  schedule: Schedule; // TODO: Put required data into separate props or new data type
  onScheduleDeleted?: ScheduleDeletionCallback;
  onScheduleSelected?: ScheduleSelectionCallback;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(2),
    },
    iconButton: {
      margin: theme.spacing(1),
    },
  }),
);

/**
 * A summary of a schedule for use in a list.
 */
function ScheduleListItem(props: ScheduleListItemProps) {
  const { id, name, lastUpdated } = props.schedule;
  const lastUpdatedLabel = `Last updated ${lastUpdated}`;

  const classes = useStyles();
  const open = Boolean(false);
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(null);

  const openMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorElement(event.currentTarget);
  };

  const onMenuClose = () => {
    setAnchorElement(null);
  };

  return (
    <ListItem>
      <Link to={`/schedules/${props.schedule}`}>
        <ListItemText primary={name} secondary={lastUpdatedLabel}></ListItemText>
      </Link>
      <Popover
        id={`scheduleItemMenu-${id}`}
        open={open}
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        anchorEl={anchorElement}
        onClose={onMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
      <ListItemSecondaryAction>
        <Tooltip title="Options" aria-label="options">
          <IconButton
            onClick={openMenu}
            edge="end"
            aria-label="menu"
            classes={{
              root: classes.iconButton,
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
  // </Link>;
}

export default ScheduleListItem;
