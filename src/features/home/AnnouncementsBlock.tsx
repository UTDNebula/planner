import React from 'react';
import { colors, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { Notice } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(2),
    backgroundColor: colors.grey[200],
    overflowY: 'scroll',
  },
  announcementItem: {
  },
}));

/**
 * Component properties for an AnnouncementsBlock.
 */
export interface AnnouncementsBlockProps {
  notices: Notice[];
}

/**
 * A display for announcements and suggestions useful for a student.
 */
export default function AnnouncementsBlock(props: AnnouncementsBlockProps) {
  const { notices } = props;

  const classes = useStyles();

  const noticeItems = notices.map((notice) => {
    return (
      <li className={classes.announcementItem}>
        <div>
          {notice.title}
        </div>
        {notice.action &&
          <a href={notice.action.link}>{notice.action.text}</a>
        }
      </li>
    );
  });

  return (
    <div className={classes.root}>
      <Typography variant="h5">Notices and Recommendations</Typography>
      <ul>
        <Typography variant="body1">{noticeItems}</Typography>
      </ul>
    </div>
  );
}