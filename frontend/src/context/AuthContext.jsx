import React, {
  createContext, useContext, useState, useMemo,
} from 'react';

const AuthContext = createContext();

const MyAuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  const saveToken = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('login', username);
  };
  const getName = localStorage.getItem('login');
  const getToken = localStorage.getItem('token');

  return (
    <AuthContext.Provider value={useMemo(() => ({
      auth, setAuth, saveToken, getName, getToken,
    }), [auth, setAuth, getName, getToken])}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default MyAuthContextProvider;
export function useAuthContext() {
  return useContext(AuthContext);
}
