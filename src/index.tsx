import { createRoot } from 'react-dom/client';
import { FC } from 'react';
import "./index.css";
import { Outlet, Routes, Navigate, BrowserRouter, Route, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"
import { DeviceContextProvider } from './contexts/DeviceContext';
import { AuthenticationProvider } from './contexts/AuthContext';
import DeviceContainerView from './components/views/DeviceContainer.view';
import LoginView from './components/views/Login.view';
import SignupView from './components/views/Signup.view';
import { FirebaseConfig } from './configs/FirebaseConfig';
import { initializeApp } from 'firebase/app';
import { useLocation } from "react-router-dom";


/** Creates a prive route wrapper, that check if its a authenticated user. router wrapper can also be used for restrict authenticated users from page using restricted variable */
const PrivateRouteWrapper: FC<{restricted?: boolean, redirectTo: string}> = ({restricted = false, redirectTo}) => {
  const auth = useAuth();
  return ((auth.getToken() !== null) === restricted) ? <Navigate to={redirectTo} /> : <Outlet />;
};

const Header: FC = () => {
  const auth = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const opacityFromPath = (path: string): number => {
    if (path == currentPath) return 1;
    else return 0.5;
  }

  if (auth.getToken()) {
    return (
      <div className='header-container'>
        <Link style={{opacity: opacityFromPath('/')}} to={'/'}>Devices</Link>
        <Link style={{opacity: opacityFromPath('/groups')}} to={'/groups'}>Groups</Link>
        <Link style={{opacity: opacityFromPath('/routines')}} to={'/routines'}>Routines</Link>
        <a onClick={() => auth.logout(() => null)} id='logout'>Logout</a>
      </div>
    );
  }

  return (
    <div className='header-container'>
      <Link style={{opacity: opacityFromPath('/login')}} to={'/login'}>Login</Link>
      <Link style={{opacity: opacityFromPath('/signup')}} to={'/signup'}>Signup</Link>
    </div>
  );
}


const App: FC = () => {

  // Init Firebase
  initializeApp(FirebaseConfig);

  return (
    <AuthenticationProvider>
      <DeviceContextProvider>    
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Private Routes */}
            <Route path='/' element={<PrivateRouteWrapper redirectTo='/login' />}>
              <Route index element={<DeviceContainerView />} />
              <Route path='groups' element={<h1>Not implemented</h1>} />
              <Route path='routines' element={<h1>Not implemented</h1>} />
            </Route>

            {/* Test devices without auth path */}
            <Route path='/testdevice' element={<DeviceContainerView />} />

            {/* Restricted for authenticated users */}
            <Route path="/" element={<PrivateRouteWrapper restricted={true} redirectTo='/' />}>
              <Route path="login" element={<LoginView />} />
              <Route path="signup" element={<SignupView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DeviceContextProvider>
    </AuthenticationProvider>
  )
}

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);