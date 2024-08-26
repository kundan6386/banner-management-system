import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <div class="banner-box px-0 px-md-4 px-2 py-md-3 pb-0 pt-3 col-xl-5 col-lg-8 m-auto auto-center">
        <div class="boxLayout p-md-4 p-3 box-outline-shadow">
          <h1>Sign In</h1>
          <div class="mt-3 bannerLayout">
            <Form onSubmit={submitHandler}>
              <div class="bannerLayout-Row">
                <div class="bannerLayout-col row">
                  <div class="d-flex flex-column mb-md-2 mb-2 colWide" controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type='email'
                      placeholder='Enter email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                  </div>
                
                  <div class="d-flex flex-column mb-md-2 mb-2 colWide" controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='Enter password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                  </div>
                </div>
              </div>
              <div class="BtnLayout d-flex justify-content-end mt-2">
                <Button
                  disabled={isLoading}
                  type='submit'
                  variant='primary'
                  className='btnfull'
                >
                  Sign In
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
      {/* {isLoading && <Loader />} */}
    </FormContainer>
  );
};

export default LoginScreen;
