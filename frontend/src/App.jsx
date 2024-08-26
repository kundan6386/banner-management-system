import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import SideBar from './components/SideBar';
import './index.css';
import { useState } from 'react';

const App = () => {
  const location = useLocation(); // Get the current location
  const showSidebar = location.pathname !== '/login'; // Conditionally render the sidebar
  const showHeader = location.pathname !== '/login'; // Conditionally render the header

  const [toggleSidebar, setToggleSidebar] = useState(false);

  // Conditionally add 'act' class based on the route
  const pageContentClass = location.pathname === '/login' ? 'page-content ms-0' : 'page-content';

  return (
    <>
      <div className='bmsdashboard-wrapper'>
        <ToastContainer />
        {showSidebar && <SideBar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} className="left-slidebar"/>} {/* Render the sidebar if the path is not '/login' */}
        <div className={pageContentClass}>
          {showHeader && <Header setToggleSidebar={setToggleSidebar} />} {/* Render the header if the path is not '/login' */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;
