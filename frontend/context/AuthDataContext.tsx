"use client";
import React, { createContext } from "react";

export const AuthDataContext = createContext<{ serverUrl: string }>({
  serverUrl: "http://localhost:7979",
});

const AuthContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const serverUrl =  "http://localhost:7979";
  return (
    <AuthDataContext.Provider value={{ serverUrl }}>
      {children}
    </AuthDataContext.Provider>
  );
};

export default AuthContext;