import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#FF5733", 0.15),
  "&:hover": {
    backgroundColor: alpha("#FF5733", 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "400px",
  },
}));

const SearchIconWrapper = styled(IconButton)(() => ({
  padding: "8px 0px 8px 8px",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "right",
}));

const AutocompleteInputBase = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: "#FF5733",
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    height: "7px",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "60ch",
    },
  },
  "& .MuiOutlinedInput-root": {
    paddingLeft: "35px",
    "& fieldset": {
      borderColor: alpha("#FF5733", 0.25),
    },
    "&:hover fieldset": {
      borderColor: alpha("#FF5733", 0.35),
    },
    "&.Mui-focused fieldset": {
      borderColor: alpha("#FF5733", 0.35),
    },
  },
}));

const AdminSearchBar = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const fetchOptions = useCallback(
    debounce(() => {
      if (query === "") {
        setOptions([]);
        return;
      }
      axios
        .get(`${import.meta.env.VITE_API_BACKEND}/api/search-users`, {
          params: {
            search: query,
            limit: 7,
            name: true,
          },
        })
        .then((response) => {
          const names: string[] = response.data.map(
            (user: { name: string }) => user.name
          );
          setOptions(names);
        })
        .catch((error) => console.log(error));

      axios
        .get(`${import.meta.env.VITE_API_BACKEND}/api/search-books`, {
          params: {
            search: query,
            limit: 7,
            title: true,
          },
        })
        .then((response) => {
          const titles: string[] = response.data.map(
            (book: { title: string }) => book.title
          );
          setOptions(prevOptions=>[...prevOptions,...titles]);
        })
        .catch((error) => console.log(error));
    }, 500),
    [query, setOptions]
  );

  useEffect(() => {
    fetchOptions();
    return () => {
      fetchOptions.cancel();
    };
  }, [query, fetchOptions]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate(`/admin/search?query=${encodeURIComponent(query)}`);
      if (inputRef.current) {
        inputRef.current.blur();
      }
      event.preventDefault();
    }
  };

  const handleOptionSelect = (
    _event: React.SyntheticEvent,
    value: string | null
  ) => {
    if (value) {
      navigate(`/admin/search?query=${encodeURIComponent(value)}`);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon sx={{ color: "#FF5733" }} />
      </SearchIconWrapper>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={query}
        onInputChange={(_event, newInputValue) => setQuery(newInputValue)}
        onChange={handleOptionSelect}
        renderInput={(params) => (
          <AutocompleteInputBase
            {...params}
            placeholder="Search…"
            inputRef={inputRef}
            onKeyPress={handleKeyPress}
            inputProps={{
              ...params.inputProps,
              "aria-label": "search",
            }}
          />
        )}
      />
    </Search>
  );
};

export default AdminSearchBar;
