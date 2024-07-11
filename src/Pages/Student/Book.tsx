import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import CoverImg from "../../Components/CoverImg";

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

const Book = ({ user_id }: { user_id: string | undefined}) => {
  const { book_id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [bookmarked, setBookmarked] = useState<Boolean | null>(null);
  const [issued, setIssued] = useState<Boolean | null>(null);

  const fetchBook = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/books/${book_id}`)
      .then((response) => {
        return setBook(response.data[0]);
      })
      .catch((error) => {
        return console.log(error);
      });

    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/check-bookmark`, {
        params: {
          user_id,
          book_id: book_id,
        },
      })
      .then((response) => {
        return setBookmarked(response.data.length === 0 ? false : true);
      })
      .catch((error) => {
        return console.log(error);
      });

    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/issues/check-issue`, {
        params: {
          user_id,
          book_id: book_id,
        },
      })
      .then((response) => {
        return setIssued(response.data.length === 0 ? false : true);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [book_id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleBookmark = useCallback(() => {
    if (bookmarked !== null) {
      if (bookmarked) {
        axios
          .post(`${import.meta.env.VITE_API_BACKEND}/api/remove-bookmark`, {
            user_id,
            book_id: book_id,
          })
          .then((response) => {
            if (response.status === 200) {
              setBookmarked(false);
            }
          })
          .catch((error) => {
            return console.log(error);
          });
      } else {
        axios
          .post(`${import.meta.env.VITE_API_BACKEND}/api/add-bookmark`, {
            user_id,
            book_id: book_id,
          })
          .then((response) => {
            if (response.status === 200) {
              setBookmarked(true);
            }
          })
          .catch((error) => {
            return console.log(error);
          });
      }
    }
  }, [book_id, bookmarked]);

  const handleImgError = ()=>{
    setBook(prevBook=>{
      const tempBook = prevBook;
      if(tempBook) tempBook.cover_img = "/loading.jpg";
      return tempBook;
    });
  }

  const handleIssue = useCallback(() => {
    if (issued !== null) {
      if (issued) {
        axios
          .post(`${import.meta.env.VITE_API_BACKEND}/api/issues/return-book`, {
            user_id,
            book_id: book_id,
          })
          .then((response) => {
            if (response.status === 200) {
              setIssued(false);
            }
          })
          .catch((error) => {
            return console.log(error);
          });
      } else {
        axios
          .post(`${import.meta.env.VITE_API_BACKEND}/api/issues/issue-book`, {
            user_id,
            book_id: book_id,
          })
          .then((response) => {
            if (response.status === 200) {
              setIssued(true);
            }
          })
          .catch((error) => {
            return console.log(error);
          });
      }
    }
  }, [book_id, issued]);

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
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                color="error"
                onClick={
                  book?.remaining && book?.remaining > 0
                    ? handleIssue
                    : () => console.log("Out Of Stock")
                }
              >
                {book?.remaining && book?.remaining > 0
                  ? issued
                    ? "Return Book"
                    : "Issue Book"
                  : "Out Of Stock"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                color="error"
                onClick={handleBookmark}
              >
                {bookmarked ? "Remove Bookmark" : "Bookmark"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Book;
