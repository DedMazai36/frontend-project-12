import React, {
  createContext, useContext, useState, useMemo,
} from 'react';

const AuthContext = createContext();

const MyAuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [username, setUsername] = useState(() => localStorage.getItem('login'));

  const unlogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    setToken(null);
    setUsername(null);
  };
  const isAuth = !!token;

  const authContextValue = useMemo(() => {
    const login = (newToken, newUsername) => {
      localStorage.setItem('token', newToken);
      localStorage.setItem('login', newUsername);
      setToken(newToken);
      setUsername(newUsername);
    };

    return {
      token,
      username,
      isAuth,
      login,
      unlogin,
    };
  }, [isAuth, token, username]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default MyAuthContextProvider;
export function useAuthContext() {
  return useContext(AuthContext);
}
