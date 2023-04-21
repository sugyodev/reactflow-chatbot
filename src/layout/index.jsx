import React from 'react';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Toolbar from './Toolbar';
import Navbar from './Navbar';

const Layout = () => {

  return (
    <>
      <React.Fragment>
        <>
          {/* <Toolbar />  */}
          {/* <Navbar />  */}
        </>
        <Outlet />
      </React.Fragment>
    </>
  );
};

export default Layout;