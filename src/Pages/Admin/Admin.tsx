import AdminNavbar from "../../Components/AdminNavbar";

import { Outlet } from "react-router-dom";

const Admin = ({notificationCount}:{notificationCount:number}) => {
  return (
    <>
      <AdminNavbar notificationCount={notificationCount} />
      <Outlet/>
    </>
  );
};

export default Admin;
