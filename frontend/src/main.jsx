import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Banners from './components/Banners.jsx';
import AddBanners from './components/AddBanners.jsx';
import UpdateBanner from './components/UpdateBanner.jsx';
import CreatePage from './components/createPage.jsx';
import Pages from './components/Pages.jsx';
import AddPageAttribute from './components/AddPageAttributes.jsx';
import PageAttributesList from './components/PageAttributesList.jsx';
import UpdatePageAttribute from './components/updatePageAttribute.jsx';
import UpdatePage from './components/UpdatePage.jsx';
import Activity from './components/Activity.jsx';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
      <Route index={true} path='/' element={<HomeScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/banners' element={<Banners />} />
        <Route path='/add-banners' element={<AddBanners />} />
        <Route path='/update-banner/:id' element={<UpdateBanner />} />
        <Route path='/create-page' element={<CreatePage />} />
        <Route path='/update-page/:id' element={<UpdatePage />} />
        <Route path='/page-list' element={<Pages />} />
        <Route path='/create-page-attributes' element={<AddPageAttribute />} />
        <Route path='/page-attributes-list' element={<PageAttributesList />} />
        <Route path='/update-page-attribute/:id' element={<UpdatePageAttribute />} />
        <Route path='/activity-list/:id' element={<Activity />}/>
        
      </Route>

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
