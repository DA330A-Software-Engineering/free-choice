import { createRoot } from 'react-dom/client';
import { FC } from 'react';
import './index.css';
import DeviceContainer from './views/DeviceContainer.view'

const App: FC = () => {
    return (
        <>
          <DeviceContainer />
        </>
    )
}

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);