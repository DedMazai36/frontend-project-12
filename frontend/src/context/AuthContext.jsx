import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const MyAuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default MyAuthContextProvider;
export function useAuthContext() {
  return useContext(AuthContext);
}
