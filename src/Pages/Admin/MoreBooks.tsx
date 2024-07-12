import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CoverImg from "../../Components/CoverImg";

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

const MoreBooks = () => {
  const { title } = useParams();

  const [books, setBooks] = useState<Books[]>([]);

  const formatString = useCallback((string: string | undefined) => {
    return !string
      ? undefined
      : string
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
  },[]);

  const fetchBooks = useCallback(() => {
    if (title === "newly_added") {
      axios
        .get(`${import.meta.env.VITE_API_BACKEND}/api/books/recently-added`)
        .then((response) => setBooks(response.data))
        .catch((error) => console.log(error));

    }
  },[setBooks]);

  useEffect(()=>{
    fetchBooks();
  },[fetchBooks]);

  return (
    <Box mx={3}>
      <Typography variant="h6" sx={{fontSize:{xs:20,sm:27} ,my:1}}>
        {formatString(title)}
      </Typography>
      <Grid container spacing={2}>
        {books.map((book) => {
          return (
            <Grid item xs={4} sm={2} pb={1} key={book?.id}>
              <Link to={`/admin/book/${book?.id}`}>
              <CoverImg src={book.cover_img} alt="Loading..." fallbackSrc="/loading.jpg" />
                <Typography
                  variant="body1"
                  component="p"
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    textWrap: "wrap",
                    height: "45px",
                    mt:1
                  }}
                >
                  {book?.title}
                </Typography>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MoreBooks;
