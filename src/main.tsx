import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ElectionProvider } from './context/ElectionContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <ElectionProvider>
      <App />
    </ElectionProvider>
  </AuthProvider>
);

