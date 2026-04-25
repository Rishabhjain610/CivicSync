"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "../../lib/store";
import AuthContext from "../../context/AuthDataContext";
import UserDataContext from "../../context/UserDataContext";
import { ThemeProvider } from "next-themes";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthContext>
        <UserDataContext />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </AuthContext>
    </Provider>
  );
};

export default Providers;