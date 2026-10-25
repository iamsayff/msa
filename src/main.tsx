import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ElectionProvider } from './context/ElectionContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AuthProvider>
      <ElectionProvider>
        <App />
      </ElectionProvider>
    </AuthProvider>
  </ErrorBoundary>
);

