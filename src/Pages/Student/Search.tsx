import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CoverImg from "../../Components/CoverImg";

interface Books {
  id:string;
  title:string;
  cover_img:string;
}

const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";

  const [searchBooks,setSearchBooks] = useState<Books[]>([]);

  const fetchSearchBooks = useCallback( ()=>{
    axios.get(`${import.meta.env.VITE_API_BACKEND}/api/search-books`,{
      params: {
        search: query
      }
    })
    .then((response)=>{
      return setSearchBooks(response.data);
    })
    .catch((error)=>{
      return console.log(error);
    })
  },[query, setSearchBooks]);

  useEffect(()=>{
    fetchSearchBooks();
  },[query,fetchSearchBooks]);

  return (
    <Box mx={3}>
      <Typography variant="h6" sx={{fontSize:{xs:20,sm:27} ,my:1}}>
        Search Results: {query}
      </Typography>
      <Grid container spacing={2}>
        {searchBooks.map((book) => {
          return (
            <Grid item xs={4} sm={2} pb={1} key={book.id}>
              <Link to={`/student/${book.id}`}>
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
