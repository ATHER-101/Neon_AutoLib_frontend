import {
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoverImg from "../../Components/CoverImg";
import OTPInput from "../../Components/OTPInput";

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

  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [currentBook, setCurrentBook] = useState<Books | null>(null);

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

  const handleReturn = useCallback(() => {
    axios
      .post(`${import.meta.env.VITE_API_BACKEND}/api/issues/return-book`, {
        user_id,
        book_id: currentBook?.id,
      })
      .then(() => {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== currentBook?.id));
        setOpen(false);
        setOtp("");
        setOtpError("");
        setCurrentBook(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user_id, currentBook]);

  
  const handleOtpVerify = useCallback(() => {
    if (otp.length === 4) {
      axios
        .post(`${import.meta.env.VITE_API_BACKEND}/api/verify-otp`, {
          user_id,
          book_id: currentBook?.id,
          otp,
        })
        .then((response) => {
          if (response.status === 200) {
            handleReturn();
          } else {
            setOtpError("Invalid OTP");
          }
        })
        .catch((error) => {
          setOtpError("Failed to verify OTP");
          console.log(error);
        });
    } else {
      setOtpError("OTP must be 6 digits");
    }
  }, [otp, user_id, currentBook, handleReturn]);


  const handleReturnClick = (book: Books) => {
    axios
      .post(`${import.meta.env.VITE_API_BACKEND}/api/return-otp`, {
        user_id,
        book_id: book?.id,
        book_title: book?.title,
      })
      .then(() => {
        setOpen(true);
        setCurrentBook(book);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    if (currentBook) {
      axios
        .delete(`${import.meta.env.VITE_API_BACKEND}/api/return-otp`, {
          data: {
            user_id,
            book_id: currentBook.id,
            book_title: currentBook.title,
          },
        })
        .then(() => {
          setOpen(false);
          setOtp("");
          setOtpError("");
          setCurrentBook(null);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Box>
      <Typography
        component="h6"
        sx={{
          fontSize: { xs: 25, sm: 35 },
          textWrap: "wrap",
          mx: { xs: 2, sm: 3 },
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
          mx: { xs: 2, sm: 3 },
        }}
      >
        {user?.email}
      </Typography>

      <Box sx={{ mx: { xs: 2, sm: 3 } }}>
        {user?.recent_genres.map((genre: string) => (
          <Chip
            key={genre}
            label={genre}
            color="error"
            variant="outlined"
            sx={{ mb: 1, mr: 1 }}
          />
        ))}
      </Box>

      {/* book scroller */}
      <Box
        sx={{
          py: 1,
          pt: 2,
          mt: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
          bgcolor: "#FF5733",
          color: "white",
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
          {books?.map((book) => (
            <Box
              sx={{
                display: "inline-block",
                width: { xs: "120px", sm: "150px" },
                height: { xs: "180px", sm: "225px" },
                mr: 2,
              }}
              key={book.id}
            >
              <CoverImg
                src={book.cover_img}
                alt="Loading..."
                fallbackSrc="/loading.jpg"
              />
              <Typography
                sx={{
                  pt: 1,
                  px: 0.4,
                  width: "100%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  textWrap: "wrap",
                  height: "55px",
                }}
              >
                {book.title}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleReturnClick(book)}
                sx={{
                  mb: 3,
                  mt: 0.5,
                  width: "100%",
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    backgroundColor: alpha("#ffffff", 0.08),
                    borderColor: "white",
                  },
                }}
              >
                Return
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={(_event, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false);
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>Enter Consent Code</DialogTitle>
        <DialogContent sx={{ px: 4, pb: 2 }}>
          <Box sx={{ pt: 1 }}>
            <OTPInput otp={otp} setOtp={setOtp} />
          </Box>
          {otpError !== "" && (
            <Typography color="error" pt={0.5}>
              {otpError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#FF5733" }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button sx={{ color: "#FF5733" }} onClick={handleOtpVerify}>
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default User;
