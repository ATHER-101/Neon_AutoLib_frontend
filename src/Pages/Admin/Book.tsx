import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Book {
  id: string;
  title: string;
  description: string;
  cover_img: string;
  genre: string;
  quantity: number;
  remaining: number;
  added: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Book = () => {
  const { book_id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchBook = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/books/${book_id}`)
      .then((response) => {
        return setBook(response.data[0]);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [book_id]);

  const fetchUsers = useCallback(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BACKEND
        }/api/issues/issue-users?book_id=${book_id}`
      )
      .then((response) => {
        return setUsers(response.data);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [book_id]);

  useEffect(() => {
    fetchBook();
    fetchUsers();
  }, [fetchBook, fetchUsers]);

  const handleImgError = () => {
    setBook((prevBook) => {
      const tempBook = prevBook;
      if (tempBook) tempBook.cover_img = "/loading.jpg";
      return tempBook;
    });
  };

  return (
    <Grid container spacing={2} p={2}>
      <Grid item xs={12} sm={3.5}>
        <Paper
          component="img"
          src={book?.cover_img}
          alt="Loading..."
          onError={handleImgError}
          sx={{
            aspectRatio: "6 / 9",
            width: "100%",
            objectFit: "cover",
            borderRadius: 1.5,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={8.5}>
        <Box
          sx={{
            px: { xs: 0, sm: 4 },
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            component="h6"
            sx={{
              fontSize: { xs: 25, sm: 35 },
              textWrap: "wrap",
              mb: 0.5,
            }}
          >
            {book?.title}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: 18,
              mb: 0.5,
            }}
          >
            {book?.description}
          </Typography>
          <Chip
            label={book?.genre}
            color="error"
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Box pb={1}>
            <Typography component="span" pr={2}>
              Total: {book?.quantity}
            </Typography>
            <Typography component="span">
              Available: {book?.remaining}
            </Typography>

            {users.length !== 0 && (
              <Typography sx={{ fontSize: 18, mt: 4, mb: 1 }}>
                Issues By
              </Typography>
            )}
            <Grid container spacing={2}>
              {users.map((user) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{ width: "100%" }}
                    key={user.id}
                  >
                    <Link to={`/admin/user/${user.id}`}>
                      <Box
                        sx={{
                          borderRadius:"5px",
                          bgcolor:"white",
                          width: "100%",
                          px: 2,
                          py: 1,
                          borderColor: "#FF5733",
                          borderWidth: "1px",
                        }}
                      >
                        <Typography sx={{ fontSize: 17 }}>
                          {user.name}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#FF5733" }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Book;
