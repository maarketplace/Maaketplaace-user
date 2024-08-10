import './global/styles.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ThemeProvider } from './context/DarkTheme.tsx';
import { UserProvider } from './context/GetUser.tsx';
import { CartProvider } from './context/Auth.tsx';

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
