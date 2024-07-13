import { alpha, Box, Button } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminBookScroller from "../../Components/AdminBookScroller";

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

const Home = () => {
  const navigate = useNavigate();
  const lastLocation = localStorage.getItem("lastLocation");

  useEffect(()=>{if (lastLocation) {
    navigate(lastLocation, { replace: true });
    localStorage.removeItem("lastLocation");
  }},[])

  const [newArrivals, setNewArrivals] = useState<Books[]>([]);

  const fetchNewArrivals = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/books/recently-added`, {
        params: {
          limit: 12,
        },
      })
      .then((response) => setNewArrivals(response.data))
      .catch((error) => console.log(error));
  }, [setNewArrivals]);

  useEffect(() => {
    fetchNewArrivals();
  }, [fetchNewArrivals]);

  return (
    <Box>
      <AdminBookScroller
        title="newly_added"
        books={newArrivals}
        colored={true}
      />

      <Box sx={{ p: 2 }}>
        <Link to="/admin/add-books">
          <Button
            variant="outlined"
            size="large"
            sx={{
              width: "100%",
              color: "#FF5733",
              borderColor: "#FF5733",
              "&:hover": {
                backgroundColor: alpha("#FF5733", 0.08),
                borderColor: "#FF5733",
              },
            }}
          >
            Add New Books
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Home;
