import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import './index.css';

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0a0e1a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0a0e1a' },
          },
        }}
      />
    </>
  );
}
