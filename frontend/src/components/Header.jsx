// import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';


const Header = ({ setToggleSidebar }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar className='navbar-classic navbar navbar-expand-lg navbar navbar-expand navbar-light bg-white' collapseOnSelect>
        <div className='d-flex justify-content-between w-100'>
          <div class="d-flex align-items-center justify-content-between w-100">
            <div class="navbar-title">

              <div class="nav-toggle d-flex gap-2 d-md-none">
                <img onClick={() => setToggleSidebar(true)} src="/hamburger.svg" width="24" height="24" class="img-fluid d-block d-md-none" alt="icon" />
              </div>

              {/* <h1 className='mb-0'>Banner Dashboard</h1> */}
            </div>
            <div class="navbar-right-wrap ms-2 d-flex nav-top-wrap navbar-nav">
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='ms-auto'>
                  {userInfo ? (
                    <>
                      <NavDropdown title={userInfo.name} id='username'>
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={logoutHandler}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  ) : (
                    <>
                      <LinkContainer to='/login'>
                        <Nav.Link>
                          <FaSignInAlt /> Sign In
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </div>
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
