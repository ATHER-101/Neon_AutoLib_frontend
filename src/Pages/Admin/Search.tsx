import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CoverImg from "../../Components/CoverImg";

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

interface Users {
  id: string;
  name: string;
  email: string;
}

const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";

  const [searchBooks, setSearchBooks] = useState<Books[]>([]);
  const [searchUsers, setSearchUsers] = useState<Users[]>([]);

  const fetchSearchBooks = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/search-books`, {
        params: {
          search: query,
        },
      })
      .then((response) => {
        return setSearchBooks(response.data);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [query, setSearchBooks]);

  const fetchSearchUsers = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/search-users`, {
        params: {
          search: query,
        },
      })
      .then((response) => {
        return setSearchUsers(response.data);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [query, setSearchUsers]);

  useEffect(() => {
    fetchSearchBooks();
    fetchSearchUsers();
  }, [query, fetchSearchBooks, fetchSearchUsers]);

  return (
    <Box mx={3}>
      <Typography variant="h6" sx={{ fontSize: { xs: 20, sm: 27 }, my: 1 }}>
        Search Results: {query}
      </Typography>

      <Grid container spacing={1.5} mb={3}>
        {searchUsers.map((user) => {
          return (
            <Grid item xs={12} sm={3} key={user.id}>
              <Link to={`/admin/user/${user.id}`}>
                <Box
                  sx={{
                    borderRadius: "5px",
                    bgcolor:"white",
                    px: 2,
                    py: 1,
                    borderColor: "#FF5733",
                    borderWidth: "1px",
                  }}
                >
                  <Typography sx={{ fontSize: 17 }}>{user.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#FF5733" }}>
                    {user.email}
                  </Typography>
                </Box>
              </Link>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        {searchBooks.map((book) => {
          return (
            <Grid item xs={4} sm={2} pb={1} key={book.id}>
              <Link to={`/admin/book/${book.id}`}>
                <CoverImg
                  src={book.cover_img}
                  alt="Loading..."
                  fallbackSrc="/loading.jpg"
                />
                <Typography
                  variant="body1"
                  component="p"
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    textWrap: "wrap",
                    height: "45px",
                    mt: 1,
                  }}
                >
                  {book.title}
                </Typography>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Search;
