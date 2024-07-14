import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import OTPInput from "../../Components/OTPInput";

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

const Book = ({
  user_id,
  user_name,
}: {
  user_id: string | undefined;
  user_name: string | undefined;
}) => {
  const { book_id } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [bookmarked, setBookmarked] = useState<Boolean | null>(null);
  const [issued, setIssued] = useState<Boolean | null>(null);

  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

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

  const handleImgError = () => {
    setBook((prevBook) => {
      const tempBook = prevBook;
      if (tempBook) tempBook.cover_img = "/loading.jpg";
      return tempBook;
    });
  };

  const handleOtpVerify = useCallback(() => {
    if (otp.length === 4) {
      axios
        .post(`${import.meta.env.VITE_API_BACKEND}/api/verify-otp`, {
          user_id,
          book_id,
          otp,
        })
        .then((response) => {
          if (response.status === 200) {
            handleIssue();
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
  }, [otp, user_id, book_id]);

  const handleIssue = useCallback(() => {
    if (issued !== null) {
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

      axios
        .delete(`${import.meta.env.VITE_API_BACKEND}/api/notifications`, {
          data: {
            user_id: `admin`,
            title: `Issue Request by ${user_name}`,
            description: `Consent Code for issueing ${book?.title} by ${user_name} is [${otp}]`,
          },
        })
        .then(() => {
          setOpen(false);
          setOtp("");
          setOtpError("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [book_id, issued, user_id, otp]);

  const handleIssueClick = () => {
    axios
      .post(`${import.meta.env.VITE_API_BACKEND}/api/issue-otp`, {
        user_id,
        user_name,
        book_id,
        book_title: book?.title,
      })
      .then(() => setOpen(true))
      .catch((error) => {
        return console.log(error);
      });
  };

  const handleCancel = () => {
    axios
      .delete(`${import.meta.env.VITE_API_BACKEND}/api/issue-otp`, {
        data: {
          user_id,
          user_name,
          book_id,
        },
      })
      .then(() => {
        setOpen(false);
        setOtp("");
        setOtpError("");
      })
      .catch((error) => {
        return console.log(error);
      });
  };

  return (
    <>
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
                  disabled={issued || issued === null ? true : false}
                  onClick={
                    book?.remaining && book?.remaining > 0
                      ? handleIssueClick
                      : () => console.log("Out Of Stock")
                  }
                >
                  {book?.remaining && book?.remaining > 0
                    ? issued
                      ? "Book Issued"
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
    </>
  );
};

export default Book;
