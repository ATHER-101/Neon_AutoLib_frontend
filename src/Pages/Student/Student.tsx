import Navbar from "../../Components/Navbar";

import { Outlet } from "react-router-dom";

const Student = ({notificationCount}:{notificationCount:number}) => {
  return (
    <>
      <Navbar  notificationCount={notificationCount} />
      <Outlet/>
    </>
  );
};

export default Student;
