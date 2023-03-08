import { createRoot } from 'react-dom/client';
import { FC } from 'react';
import "./index.css";
import { Outlet, Routes, Navigate, BrowserRouter, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"
import { DeviceContextProvider } from './contexts/DeviceContext';
import { AuthenticationProvider } from './contexts/AuthContext';
import DeviceContainerView from './components/views/DeviceContainer.view';
import LoginView from './components/views/Login.view';
import SignupView from './components/views/Signup.view';


/** Creates a prive route wrapper, that check if its a authenticated user. router wrapper can also be used for restrict authenticated users from page using restricted variable */
const PrivateRouteWrapper: FC<{restricted?: boolean, redirectTo: string}> = ({restricted = false, redirectTo}) => {
  const auth = useAuth();
  return ((auth.getToken() !== null) === restricted) ? <Navigate to={redirectTo} /> : <Outlet />;
};


const App: FC = () => {
    return (
      <AuthenticationProvider>
        <DeviceContextProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Private Routes */}
              <Route path='/' element={<PrivateRouteWrapper redirectTo='/login' />}>
                <Route index element={<DeviceContainerView />} />
              </Route>

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