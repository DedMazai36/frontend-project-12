import React, {
  createContext, useContext, useState, useMemo,
} from 'react';

const AuthContext = createContext();

const MyAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return { token, username };
  });

  const unlogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser({ token: null, username: null });
  };
  const isAuth = !!user.token;

  const authContextValue = useMemo(() => {
    const login = (newToken, newUsername) => {
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', newUsername);
      setUser({ token: newToken, username: newUsername });
    };

    return {
      token: user.token,
      username: user.username,
      isAuth,
      login,
      unlogin,
    };
  }, [isAuth, user.token, user.username]);

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
