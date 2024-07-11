import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import Admin from "./Pages/Admin/Admin";
import Student from "./Pages/Student/Student";
import Home from "./Pages/Student/Home";
import Book from "./Pages/Student/Book";
import Notifications from "./Pages/Student/Notifications";
import Bookmarks from "./Pages/Student/Bookmarks";
import MoreBooks from "./Pages/Student/MoreBooks";
import Search from "./Pages/Student/Search";
import FilterBooks from "./Pages/Student/FilterBooks";
import SignIn from "./Pages/Auth/SignIn";
import LogOut from "./Pages/Auth/LogOut";
import RoleAuth from "./Pages/Auth/RoleAuth";
import AuthFailed from "./Pages/Auth/AuthFailed";

function App() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    recent_genres: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuthStatus = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/auth/status`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setUser(response.data.user);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          axios
            .post(
              `${import.meta.env.VITE_API_BACKEND}/api/auth/token`,
              {},
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              const { accessToken } = response.data;

              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${accessToken}`;

              axios
                .get(`${import.meta.env.VITE_API_BACKEND}/api/auth/status`, {
                  withCredentials: true,
                })
                .then((response) => {
                  console.log(response.data);
                  setUser(response.data.user);
                })
                .catch((error) => {
                  console.log(error);
                  setUser(null);
                });
            })
            .catch((error) => {
              console.error("Error refreshing access token", error);
              setUser(null);
            });
        } else {
          console.log(error);
          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAuthStatus();
  }, [fetchAuthStatus]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          background: `linear-gradient(rgba(255, 87, 51, 0.2), rgba(255, 87, 51, 1)), url(https://images.unsplash.com/photo-1700308234428-c619d7408fbd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Box>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            user ? <RoleAuth role={user.role} /> : <Navigate to="/signin" />
          }
        />
        <Route
          path="/student"
          element={user?.role === "student" ? <Student /> : <Navigate to="/" />}
        >
          <Route index element={<Home user_id={user?.id} />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="bookmarks" element={<Bookmarks user_id={user?.id} />} />
          <Route path="search" element={<Search />} />
          <Route path="filter-books" element={<FilterBooks />} />
          <Route path=":book_id" element={<Book user_id={user?.id} />} />
          <Route
            path="more/:title"
            element={<MoreBooks user_id={user?.id} />}
          />
        </Route>
        <Route
          path="/admin"
          element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/logout"
          element={user ? <LogOut /> : <Navigate to="/" />}
        />
        <Route
          path="/auth-failed"
          element={user ? <Navigate to="/" /> : <AuthFailed />}
        />
      </Routes>
    </>
  );
}

export default App;
