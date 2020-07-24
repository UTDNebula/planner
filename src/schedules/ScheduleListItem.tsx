import React, { useState } from 'react';
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
  List,
  ListItemIcon,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
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
 *
 * When clicked, this list item redirects to the schedule planner and opens the
 * schedule for this item's associated ID.
 */
function ScheduleListItem(props: ScheduleListItemProps) {
  const { id, name, lastUpdated } = props.schedule;
  const lastUpdatedLabel = `Last updated ${lastUpdated}`;

  const classes = useStyles();
  const [open, setOpen]= useState(false);
  const [anchorElement, setAnchorElement] = React.useState<HTMLElement | null>(null);

  const openMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorElement(event.currentTarget);
    setOpen(!open);
  };

  const onMenuClose = () => {
    setAnchorElement(null);
    setOpen(false);
  };

  const handleDeleteClick = () => {
    if (props.onScheduleDeleted) {
      props.onScheduleDeleted(id);
    }
  };

  return (
    <ListItem component={Link} to={`/schedules/${id}`} >
      <ListItemText
        primary={name}
        secondary={lastUpdatedLabel}
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
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List component="nav" aria-label="Schedule plan options">
          <ListItem button onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete plan" />
          </ListItem>
        </List>
      </Popover>
    </ListItem>
  );
}

export default ScheduleListItem;
