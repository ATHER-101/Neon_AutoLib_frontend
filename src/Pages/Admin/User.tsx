import { Box, Button, Chip, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoverImg from "../../Components/CoverImg";

interface User {
  id: string;
  name: string;
  email: string;
  recent_genres: string[];
}

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

const User = () => {
  const { user_id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Books[]>([]);

  const fetchUser = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/users?user_id=${user_id}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.log(error));
  }, [user_id, setUser]);

  const fetchIssues = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/issues/current-issues`, {
        params: {
          user_id,
        },
      })
      .then((response) => setBooks(response.data))
      .catch((error) => console.log(error));
  }, [user_id, setBooks]);

  useEffect(() => {
    fetchUser();
    fetchIssues();
  }, [fetchUser, fetchIssues, user_id]);

  return (
    <Box>
      <Typography
        component="h6"
        sx={{
          fontSize: { xs: 25, sm: 35 },
          textWrap: "wrap",
          mx:{xs:2,sm:3} ,
          mt: 2,
        }}
      >
        {user?.name}
      </Typography>
      <Typography
        component="p"
        sx={{
          fontSize: 18,
          mb: 1,
          mx:{xs:2,sm:3} 
        }}
      >
        {user?.email}
      </Typography>

      <Box sx={{ mx:{xs:2,sm:3} }}>
        {user?.recent_genres.map((genre: string) => {
          return (
            <Chip
              label={genre}
              color="error"
              variant="outlined"
              sx={{ mb: 1, mr: 1 }}
            />
          );
        })}
      </Box>

      {/* book scroller */}
        <Box
            sx={{
            py: 1,
            pt: 2,
            px:{xs:2,sm:3}
            }}
        >
            <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            >
            <Typography variant="h5" display="inline-block">
                Currently Issued
            </Typography>
            </Box>
            <Box
            sx={{
                width: "100%",
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                "&::-webkit-scrollbar": {
                display: "none", // Hide scrollbar in WebKit-based browsers
                },
                msOverflowStyle: "none", // Hide scrollbar in IE and Edge
                scrollbarWidth: "none", // Hide scrollbar in Firefox
                mt: 1,
            }}
            >
            {books?.map((book) => {
                return (
                <Box
                    sx={{
                    display: "inline-block",
                    width: { xs: "120px", sm: "150px" },
                    height: { xs: "180px", sm: "225px" },
                    mr: 2,
                    }}
                >
                    <CoverImg
                    src={book.cover_img}
                    alt="Loading..."
                    fallbackSrc="/loading.jpg"
                    />
                    <Typography
                    sx={{
                        pt: 1,
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textWrap: "wrap",
                        maxHeight: "55px",
                    }}
                    >
                    {book.title}
                    </Typography>
                    <Button size="small" variant="outlined" color="error" sx={{mb:2, width:"100%"}}>Return</Button>
                </Box>
                );
            })}
            </Box>
        </Box>

    </Box>
  );
};

export default User;
