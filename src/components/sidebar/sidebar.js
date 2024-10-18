import React, {useState } from 'react';
import './sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import RoutingPaths from 'Helper/routingPath';

const SidebarLayout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(true);

  const SidebarList = [
    {
      id:1,
      title: 'Home',
      path: RoutingPaths.home,
      icon: 'pi pi-fw pi-home me-2',
    },
    {
      id:2,
      title: 'Inventories',
      path: RoutingPaths.inventoryList,
      icon: 'pi pi-fw pi-list me-2',
    },
    {
      id:3,
      title: 'Users',
      path: RoutingPaths.usersList,
      icon: 'pi pi-fw pi-list me-2',
    },
    {
      id:4,
      title: 'Profile',
      path: RoutingPaths.profile,
      icon: 'pi pi-fw pi-home me-2',
    }
  ]

  //   const toggleSidebar = () => {
  //     setIsOpen(!isOpen);
  //   };

  return (
    <div className="layout">
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* <button className="toggle-button" onClick={toggleSidebar}>
          {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button> */}
        <nav>
          <div className='pt-2'>
            <h5 className='text-black ms-2 mb-3' style={{ paddingLeft: "1.5rem" }}>Menu</h5>
              {SidebarList.map(sidebarobject =>
                <ul  key={sidebarobject.id} className='active'>
                  <Link to={sidebarobject.path} className='ul-link'>
                    <li className={currentPath === sidebarobject.path ? 'active' : ''}> <i className={sidebarobject.icon}></i>{sidebarobject.title}</li></Link>
                  <hr className="solid"></hr>
                </ul>
              )};
          </div>
        </nav>
      </div>

      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;