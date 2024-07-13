import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Notifications {
  user_id: string;
  title: string;
  description: string;
}

const Notifications = ({
  user_id,
  setNotificationCount,
}: {
  user_id: string | undefined;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  const fetchNotifications = useCallback(() => {
    axios
      .get(`${import.meta.env.VITE_API_BACKEND}/api/notifications`, {
        params: {
          user_id,
        },
      })
      .then((response) => {
        setNotifications(response.data);
        setNotificationCount(response.data.length);
      })
      .catch((error) => console.log(error));
  }, [setNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <>
      {notifications.length === 0 && (
        <Typography m={1} mx={2} variant="h6">
          No New Notifications !
        </Typography>
      )}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {[...notifications]
          .reverse()
          .map((notification: Notifications, index) => {
            return (
              <Box
                key={index}
                sx={{
                  borderRadius: "5px",
                  bgcolor: "white",
                  width: "100%",
                  px: 2,
                  py: 1,
                  borderColor: "#FF5733",
                  borderWidth: "1px",
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                <Typography sx={{ fontSize: { xs: 17, sm: 20 } }}>
                  {notification.title}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: 15, sm: 17 }, color: "#FF5733" }}
                >
                  {notification.description}
                </Typography>
              </Box>
            );
          })}
      </Box>
    </>
  );
};

export default Notifications;
