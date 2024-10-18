import HeaderComponent from '../../components/header/header';
import SidebarLayout from '../../components/sidebar/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import './layout.css';

function Layout() {
  return (
    <div>
      <HeaderComponent />
      <SidebarLayout>
        <main className='main-contents'>
          <Outlet />
        </main>
      </SidebarLayout>
    </div>
  );
}

export default Layout;