import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../UserPanel/MenuBar';


const UserLayout = () => {
  return (
    <div>
      <MenuBar/>
      <Outlet />
    </div>
  );
};

export default UserLayout;
