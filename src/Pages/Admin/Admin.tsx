import AdminNavbar from "../../Components/AdminNavbar";

import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet/>
    </>
  );
};

export default Admin;
