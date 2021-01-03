import React from 'react';
import { useHistory } from 'react-router-dom';

export default function AuthPage() {
  const history = useHistory();
  history.push('/app');
  // TODO: Like actually sign in
  return (
    <div>Redirecting...</div>
  );
}
