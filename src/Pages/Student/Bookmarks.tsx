import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LazyLoadedImage from "../../Components/LazyLoadedImg";

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

const Bookmarks = ({ user_id }: { user_id: string | undefined}) => {
  const [bookmarks, setBookmarks] = useState<Books[]>([]);

  const fetchBookmarks = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/bookmarks`, {
        params: {
          user_id,
        },
      })
      .then((response) => {
        return setBookmarks(response.data);
      })
      .catch((error) => {
        return console.log(error);
      });
  }, [setBookmarks]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <Box mx={3}>
      <Typography variant="h6" sx={{ fontSize: { xs: 20, sm: 27 }, my: 1 }}>
        Bookmarks
      </Typography>
      <Grid container spacing={2}>
        {bookmarks.map((book) => {
          return (
            <Grid item xs={4} sm={2} pb={1} key={book.id}>
              <Link to={`/student/${book.id}`}>
                <LazyLoadedImage
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

export default Bookmarks;
