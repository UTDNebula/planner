import React from 'react';

/**
 * A user for this app.
 */
export interface AuthUser {
  id: string;
  name: string;
  image: string | null;
}

/**
 * A mapping of all users.
 */
export const users: { [key: string]: AuthUser } = {
  'guest': {
    id: 'guest',
    name: 'Guest',
    image: null,
  }, // No privileges
  'default': {
    id: 'default',
    name: 'Sudent',
    image: 'https://picsum.photos/256',
  }, // First (and only) signed in user
};


interface AuthContextState {
  user: any;
  switchAccounts: (accountId: 'guest' | 'default') => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextState | undefined>(undefined); // Find a better solution for this

/**
 * A React hook that exposes 
 */
function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context == null) {
    throw new Error('useAuthState must be used in an AuthContextProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser>(users.guest);

  /**
  * Switches the currently active user session.
  *
  * @param accountId 
  */
  function switchAccounts(accountId: 'guest' | 'default') {
    const user = users[accountId];
    setUser(user);
    // TODO: Update localStorage
    console.log('Switched active account to ' + accountId);
  }

  /**
   * Signs out the currently signed-in user.
   * 
   * This switches to the guest user.
   */
  function signOut() {
    const user = users.guest;
    setUser(user);
    // TODO: Update localStorage
    console.log('Signed out user; switched to guest.');
  }

  const authContextValue = {
    user,
    switchAccounts,
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, useAuthContext };