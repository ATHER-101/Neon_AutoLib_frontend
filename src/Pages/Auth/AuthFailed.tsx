import { Avatar, Box, Button, Grid, Paper, Typography } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const AuthFailed = () => {
  const googleSignIn = () => {
    window.open(`${import.meta.env.VITE_API_BACKEND}/api/auth/google`, "_self");
  };

  return (
    <>
      <Grid
      container
      component="main"
      sx={{
        height: "100svh",
        width: "100vw",
        background: `linear-gradient(rgba(255, 87, 51, 0.2), rgba(255, 87, 51, 1)), url(https://images.unsplash.com/photo-1700308234428-c619d7408fbd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid item xs={false} sm={4} md={7.5} />
      <Grid item xs={12} sm={8} md={4.5}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            pl: { xs: 4, sm: 6 },
            pr: { xs: 4, sm: 10 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 2,
              height: {xs:"80vw",sm:"70%"},
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: 125,
                mb: 5,
                top: {xs:-30,sm:-50},
                position: "relative",
              }}
            >
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: "#FF5733",
                  position: "absolute",
                  left: 0,
                  boxShadow: 2,
                  zIndex: 1,
                }}
              >
                <LockOpenIcon fontSize="large" />
              </Avatar>
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: "#FF5733",
                  position: "absolute",
                  right: 0,
                  boxShadow: 3,
                  zIndex: 2,
                }}
              >
                <AutoStoriesIcon fontSize="large" />
              </Avatar>
            </Box>

            <Typography
              component="h1"
              variant="h6"
              align="center"
              sx={{ my: 5 }}
            >
              Authorisation Failed!
            </Typography>
            <Button
              size="large"
              variant="contained"
              sx={{
                mb: { xs: 2, sm: 10 },
                width: "90%",
                bgcolor: "#FF5733",
                "&:hover": { bgcolor: "#FF5733" },
              }}
              onClick={googleSignIn}
            >
              Sign In Again
            </Button>
          </Paper>
        </Box>
      </Grid>
    </Grid>
    </>
  );
};

export default AuthFailed;