import React, { useState, ChangeEvent } from "react";
import {
  alpha,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import Papa from "papaparse";

interface Books {
  title: string;
  description: string;
  cover_img: string;
  genre: string;
  quantity: number;
}

const AddBooks = () => {
  const [books, setBooks] = useState<Books[]>([]);

  const [message, setMessage] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const addBook = () => {
    setBooks((prevBooks) => [
      ...prevBooks,
      {
        title: "",
        description: "",
        cover_img: "",
        genre: "",
        quantity: 0,
      },
    ]);
    setMessage(null);
  };

  const deleteBook = (index: number) => {
    setBooks((prevBooks) => prevBooks.filter((_, i) => i !== index));
  };

  const RemoveAllBooks = () => {
    setBooks([]);
    setMessage(null);
  };

  const saveBooks = () => {
    const checkedBooks = books.filter(
      (book) =>
        book.title !== "" &&
        book.genre !== "" &&
        book.quantity !== 0 &&
        !Number.isNaN(book.quantity)
    );

    if (checkedBooks.length > 0) {
      axios
        .post(`${import.meta.env.VITE_API_BACKEND}/api/books`, {
          books: checkedBooks,
        })
        .then((response) => {
          setMessage(response.data.message);
          setTimeout(() => setMessage(null), 1000 * 7);
        })
        .catch((error) => console.log(error));
    } else {
      setMessage("No Books were Added!");
      setTimeout(() => setMessage(null), 1000 * 7);
    }
    
    setBooks([]);
  };

  const handleCSVUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: { data: Books[] }) => {
          const newBooks = results.data;
          setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        },
      });
      setOpen(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {books.map((_book: Books, i) => (
        <Grid container spacing={1} key={i} sx={{ mb: { xs: 3, sm: 1 } }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id="outlined-controlled"
              size="small"
              fullWidth
              value={books[i].title}
              placeholder="Title"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBooks((prevBooks) => {
                  const newBooks = [...prevBooks];
                  newBooks[i].title = event.target.value;
                  return newBooks;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3.9}>
            <TextField
              id="outlined-controlled"
              size="small"
              fullWidth
              value={books[i].description}
              placeholder="Description"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBooks((prevBooks) => {
                  const newBooks = [...prevBooks];
                  newBooks[i].description = event.target.value;
                  return newBooks;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              id="outlined-controlled"
              size="small"
              fullWidth
              value={books[i].cover_img}
              placeholder="Cover image"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBooks((prevBooks) => {
                  const newBooks = [...prevBooks];
                  newBooks[i].cover_img = event.target.value;
                  return newBooks;
                });
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={1.8}>
            <TextField
              id="outlined-controlled"
              size="small"
              fullWidth
              value={books[i].genre}
              placeholder="Genre"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBooks((prevBooks) => {
                  const newBooks = [...prevBooks];
                  newBooks[i].genre = event.target.value;
                  return newBooks;
                });
              }}
            />
          </Grid>
          <Grid item xs={4.5} sm={4.5} md={0.8}>
            <TextField
              id="outlined-controlled"
              size="small"
              fullWidth
              value={books[i].quantity}
              placeholder="Quantity"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBooks((prevBooks) => {
                  const newBooks = [...prevBooks];
                  if (Number.isNaN(Number(event.target.value)))
                    return prevBooks;
                  newBooks[i].quantity = Number(event.target.value);
                  return newBooks;
                });
              }}
            />
          </Grid>
          <Grid
            item
            xs={1.5}
            sm={1.5}
            md={0.5}
            alignContent="center"
            textAlign="center"
          >
            <IconButton
              size="small"
              aria-label="show new notifications"
              sx={{ p: 1, color: "#FF5733" }}
              onClick={() => deleteBook(i)}
            >
              <DeleteOutlineIcon color="error" />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid container spacing={1} alignItems="center" mt={1.3}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              color: "#FF5733",
              borderColor: "#FF5733",
              "&:hover": {
                backgroundColor: alpha("#FF5733", 0.08),
                borderColor: "#FF5733",
              },
            }}
            onClick={() => {
                setOpen(true);
                setMessage(null);
            }}
          >
            Add from CSV File
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={9}>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item xs={6} sm={6} md={3}>
              <Button
                variant="outlined"
                sx={{
                  width: "100%",
                  color: "#FF5733",
                  borderColor: "#FF5733",
                  "&:hover": {
                    backgroundColor: alpha("#FF5733", 0.08),
                    borderColor: "#FF5733",
                  },
                }}
                onClick={addBook}
              >
                Add Book
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Button
                variant="outlined"
                sx={{
                  width: "100%",
                  color: "#FF5733",
                  borderColor: "#FF5733",
                  "&:hover": {
                    backgroundColor: alpha("#FF5733", 0.08),
                    borderColor: "#FF5733",
                  },
                }}
                onClick={RemoveAllBooks}
              >
                Remove All
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                disabled={books.length === 0 ? true : false}
                sx={{
                  width: "100%",
                  bgcolor: "#FF5733",
                  "&:hover": { bgcolor: "#FF5733" },
                }}
                onClick={saveBooks}
              >
                Save Books
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {message && (
        <Button
          color="error"
          variant="outlined"
          sx={{
            mt: 3,
            width: "100%",
            color: "#FF5733",
            borderColor: "#FF5733",
            "&:hover": {
              backgroundColor: alpha("#FF5733", 0.08),
              borderColor: "#FF5733",
            },
          }}
        >
          {message}
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddBooks;
