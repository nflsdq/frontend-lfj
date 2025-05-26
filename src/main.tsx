import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#111111',
              border: '2px solid #111111',
              borderRadius: '12px',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              padding: '16px',
              fontFamily: 'Inter, sans-serif',
            },
            duration: 3000,
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);