import Alert from '@mui/material/Alert';
import React from 'react';

/*
 * error messaging UI component
 * TBD: may need better styling
 */
const errorMessageStyle = {
  color: '#952626',
  width: '375px',
  position: 'absolute',
  zIndex: '1000000',
  padding: '10px',
  bottom: '2%',
  left: '35%',
} as React.CSSProperties;

export default function ErrorMessage(error: string) {
  return (
    <Alert id="errMess1" severity="error" style={errorMessageStyle}>
      Something went wrong - {error}!
    </Alert>
  );
}
