import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleAuth = ({ role }: { role: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else if (role === "student") {
      navigate("/student", { replace: true });
    } else {
      navigate("/signin", { replace: true });
    }
  }, [role, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: `linear-gradient(rgba(255, 87, 51, 0.2), rgba(255, 87, 51, 1)), url(https://images.unsplash.com/photo-1700308234428-c619d7408fbd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></Box>
  );
};

export default RoleAuth;
