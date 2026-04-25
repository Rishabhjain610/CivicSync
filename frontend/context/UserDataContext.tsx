"use client";
import React, { useContext, useEffect } from "react";
import { AuthDataContext } from "./AuthDataContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../lib/redux/userSlice";

const UserDataContext: React.FC = () => {
  const dispatch = useDispatch();
  const { serverUrl } = useContext(AuthDataContext);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(res.data?.user ?? null));
      } catch (error) {
        console.error("Failed to fetch user data", error);
        dispatch(setUserData(null));
      }
    };

    getCurrentUser();
  }, [dispatch, serverUrl]);

  return null;
};

export default UserDataContext;