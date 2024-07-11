import Navbar from "../../Components/Navbar";

import { Outlet } from "react-router-dom";

const Student = () => {
  return (
    <>
      <Navbar />
      <Outlet/>
    </>
  );
};

export default Student;
