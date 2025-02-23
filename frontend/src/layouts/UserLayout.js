import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHome from '../UserPanel/UserHome';

const UserLayout = () => {
  return (
    <div>
      
      <Outlet />
    </div>
  );
};

export default UserLayout;
