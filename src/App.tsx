import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Box } from "@mui/material";

import Admin from "./Pages/Admin/Admin";
import AdminNotifications from "./Pages/Admin/Notifications";
import AdminFilterBooks from "./Pages/Admin/FilterBooks";
import AdminHome from "./Pages/Admin/Home";
import AddBooks from "./Pages/Admin/AddBooks";
import AdminBook from "./Pages/Admin/Book";
import AdminUser from './Pages/Admin/User';
import AdminMoreBooks from './Pages/Admin/MoreBooks';
import AdminSearch from './Pages/Admin/Search'

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    recent_genres: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const fetchAuthStatus = useCallback(() => {
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_API_BACKEND}/api/auth/status?accessToken=${accessToken}`
      )
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid, attempt to refresh token
          axios
            .post(
              `${import.meta.env.VITE_API_BACKEND}/api/auth/token`,
              { refreshToken }
            )
            .then((response) => {
              const { accessToken: newAccessToken } = response.data;
              setAccessToken(newAccessToken);
              localStorage.setItem("accessToken", newAccessToken);

              // Retry fetching user data with new access token
              axios
                .get(
                  `${import.meta.env.VITE_API_BACKEND}/api/auth/status?accessToken=${newAccessToken}`
                )
                .then((response) => {
                  setUser(response.data.user);
                })
                .catch((error) => {
                  console.error("Error fetching user data after token refresh:", error);
                  setUser(null);
                })
                .finally(() => {
                  setLoading(false);
                });
            })
            .catch((error) => {
              console.error("Error refreshing access token:", error);
              setUser(null);
              setLoading(false);
            });
        } else {
          console.error("Error fetching auth status:", error);
          setUser(null);
          setLoading(false);
        }
      });
  }, [accessToken, refreshToken]);

  useEffect(() => {
    let access_token = searchParams.get("accessToken");
    let refresh_token = searchParams.get("refreshToken");

    if (access_token && refresh_token) {
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      navigate("/", { replace: true });
    } else {
      let storedAccessToken = localStorage.getItem("accessToken");
      let storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
      }
    }
  }, [searchParams, navigate]);

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
      >
        Loading...
      </Box>
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
        >
          <Route index element={<AdminHome/>} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="filter-books" element={<AdminFilterBooks />} />
          <Route path="add-books" element={<AddBooks />} />
          <Route path="search" element={<AdminSearch />} />
          <Route path="book/:book_id" element={<AdminBook />} />
          <Route path="user/:user_id" element={<AdminUser />} />
          <Route
            path="more/:title"
            element={<AdminMoreBooks />}
          />
        </Route>
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
