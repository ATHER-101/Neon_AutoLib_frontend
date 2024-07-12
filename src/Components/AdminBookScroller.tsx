import { Box, IconButton, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import CoverImg from "./CoverImg";

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

export default function BookScroller({
  title = "title",
  colored = false,
  books,
}: {
  title?: string;
  colored?: boolean;
  books: Books[];
}) {
  const formatString = useCallback((string: string) => {
    return string
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },[]);

  if (books.length === 0) return <></>;

  return (
    <Box
      sx={{
        bgcolor: colored ? "#FF5733" : "transparent",
        color: colored ? "white" : "black",
        py: 1,
        pt: 2,
        px: 2
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
          {formatString(title)}
        </Typography>
        <Link to={`/admin/more/${title}`}>
          <IconButton
            size="small"
          >
            <ArrowForwardIcon sx={{ color: colored ? "white" : "black" }} />
          </IconButton>
        </Link>
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
            <Link to={`/admin/book/${book?.id}`} key={book?.id}>
              <Box
                sx={{
                  display: "inline-block",
                  width: { xs: "120px", sm: "150px" },
                  height: { xs: "180px", sm: "225px" },
                  mr: 2,
                }}
              >
                <CoverImg src={book.cover_img} alt="Loading..." fallbackSrc="/loading.jpg" />
                <Typography
                  sx={{
                    pt: 1,
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    textWrap: "wrap",
                    height: "55px",
                  }}
                >
                  {book.title}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}
