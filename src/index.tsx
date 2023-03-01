import { createRoot } from 'react-dom/client';
import { FC } from 'react';
import "./index.css";

const App: FC = () => {
    return (
        <>
          <h1>Hello World</h1>
        </>
    )
}

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);