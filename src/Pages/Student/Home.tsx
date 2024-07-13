import { useCallback, useEffect, useState } from "react";
import BookScroller from "../../Components/BookScroller";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Books {
  id: string;
  title: string;
  cover_img: string;
}

interface RecentGenres {
  genre: string;
  books: Books[];
}

const Home = ({ user_id }: { user_id: string | undefined }) => {
  const navigate = useNavigate();
  const lastLocation = localStorage.getItem("lastLocation");

  useEffect(()=>{if (lastLocation) {
    navigate(lastLocation, { replace: true });
    localStorage.removeItem("lastLocation");
  }},[])

  const [issues, setIssues] = useState<Books[]>([]);
  const [newArrivals, setNewArrivals] = useState<Books[]>([]);
  const [recentGenres, setRecentGenres] = useState<RecentGenres[]>([]);

  const fetchIssues = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/issues/current-issues`, {
        params: {
          user_id,
          limit: 12,
        },
      })
      .then((response) => setIssues(response.data))
      .catch((error) => console.log(error));
  }, [setIssues]);

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

  const fetchRecentGenres = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/users/recent-genres`, {
        params: {
          user_id,
        },
      })
      .then((response) => setRecentGenres(response.data))
      .catch((error) => console.log(error));
  }, [setRecentGenres]);

  useEffect(() => {
    fetchIssues();
    fetchNewArrivals();
    fetchRecentGenres();
  }, [fetchIssues, fetchNewArrivals, fetchRecentGenres]);

  return (
    <>
      <BookScroller title="currently_issued" colored={true} books={issues} />
      <BookScroller title="new_arrivals" books={newArrivals} />
      {recentGenres.map((recentGenre: RecentGenres) => {
        return (
          <BookScroller
            key={recentGenre.genre}
            title={recentGenre.genre}
            books={recentGenre.books}
          />
        );
      })}
    </>
  );
};

export default Home;
