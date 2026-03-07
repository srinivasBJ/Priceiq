import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#eee',
            border: '1px solid #444',
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)