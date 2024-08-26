import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useState } from "react";

function SideBar({toggleSidebar,setToggleSidebar}) {

  const [activeMenuItem, setActiveMenuItem] = useState("Pages")
  const {pathname} = useLocation()

  function handleClick(){
    setToggleSidebar(false)
  }

  function handleSubMenuClick(item){
    if(activeMenuItem === item){
      setActiveMenuItem("")
    }else{

      setActiveMenuItem(item)
    }

  }
  return (
    <>
    <span onClick={handleClick} class={`overlaynavbar d-md-none d-block ${toggleSidebar? "active":""}`} ></span>
    <div class={`navbar-vertical ${toggleSidebar? "active":""}`}>
      <div class="simplebar-scrollable-y">
        <div class="simplebar-wrapper">
          <div class="simplebar-content">
            <div class="nav-scroller">
                <LinkContainer to='/' class="navbar-brand">
                  <Navbar.Brand>
                    <img
                      src={'/TJ_LOGO_en.svg'}
                      width="60" height="43"
                      className="img-fluid"
                      alt="BMS Logo" 
                    />
                  </Navbar.Brand>
                </LinkContainer>
            </div>
            <Sidebar>
              <Menu>
                
                <SubMenu onClick={()=>handleSubMenuClick("Pages")} open={activeMenuItem === "Pages"} label="Pages">
                <MenuItem active={pathname === "/create-page"} onClick={handleClick}><Link to="/create-page">Add Page</Link></MenuItem>
                  <MenuItem active={pathname === "/page-list"} onClick={handleClick}><Link to="/page-list">Page List</Link>
                  </MenuItem>
                  </SubMenu>
                <SubMenu onClick={()=>handleSubMenuClick("Attributes")} open={activeMenuItem === "Attributes"} label="Page Attributes">
                  <MenuItem active={pathname === "/create-page-attributes"} onClick={handleClick}><Link to="/create-page-attributes">Add Page Attribute</Link></MenuItem>
                  <MenuItem active={pathname === "/page-attributes-list"} onClick={handleClick}><Link to="/page-attributes-list">Page Attribute List</Link></MenuItem>
                </SubMenu>
                <SubMenu onClick={()=>handleSubMenuClick("banners")} open={activeMenuItem === "banners"} label="Banners">
                <MenuItem active={pathname === "/add-banners"} onClick={handleClick}><Link to="/add-banners">Add Banner</Link></MenuItem>
                <MenuItem active={pathname === "/banners"} onClick={handleClick} ><Link to="/banners">Banner List</Link></MenuItem>
                  
                </SubMenu>
              </Menu>
            </Sidebar>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default SideBar;
