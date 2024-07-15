import { Box, Chip, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LazyLoadedImage from "../../Components/LazyLoadedImg";

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

const FilterBooks = () => {
  const [available, setAvailable] = useState<boolean>(false);
  const [genre, setGenre] = useState<{ name: string; selected: boolean }[]>([]);
  const [books, setBooks] = useState<Books[]>([]);

  const fetchGenres = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/genre`)
      .then((response) => {
        const updatedGenre: { name: string; selected: boolean }[] =
          response.data.map((genre: { name: string }) => ({
            ...genre,
            selected: false,
          }));
        setGenre(updatedGenre);
      })
      .catch((error) => console.log(error));
  },[setGenre]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const fetchFilteredBooks = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/filter-books`, {
        params: { available, genre },
      })
      .then((response) => setBooks(response.data))
      .catch((error) => console.log(error));
  },[setBooks, available, genre]);

  useEffect(() => {
    fetchFilteredBooks();
  }, [fetchFilteredBooks]);

  const handleToggle = () => {
    setAvailable((available) => !available);
  };

  const handleToggleGenre = (index: number) => {
    setGenre((prevGenre) => {
      const newGenre = [...prevGenre];
      newGenre[index].selected = !newGenre[index].selected;

      if (newGenre[index].selected) {
        const [selectedGenre] = newGenre.splice(index, 1);
        newGenre.unshift(selectedGenre);
      }

      return newGenre;
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mx: 3,
          my: 2,
          overflowX: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
        }}
      >
        <Chip
          label="Available"
          variant={available ? "filled" : "outlined"}
          color="error"
          onClick={handleToggle}
          sx={{ mr: 1 }}
        />

        {genre.map((g: { name: string; selected: boolean }, index) => {
          return (
            <Chip
              key={index}
              label={g.name}
              variant={genre[index].selected ? "filled" : "outlined"}
              color="error"
              onClick={() => handleToggleGenre(index)}
              sx={{ mr: 1 }}
            />
          );
        })}
      </Box>
      <Box mx={3}>
        <Grid container spacing={2}>
          {books.map((book) => {
            return (
              <Grid item xs={4} sm={2} pb={1} key={book.id}>
                <Link to={`/student/${book.id}`}>
                  <LazyLoadedImage src={book.cover_img} alt="Loading..." fallbackSrc="/loading.jpg" />
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
    </>
  );
};

export default FilterBooks;
