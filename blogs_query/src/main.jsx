import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationContextProvider } from './context/NotificationContext'
import { LoginContextProvider } from './context/LoginContext'
import { UserContextProvider } from './context/UserContext'
import { BlogContextProvider } from './context/BlogContext'

import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LoginContextProvider>
        <UserContextProvider>
          <BlogContextProvider>
            <NotificationContextProvider>
              <Router>
                <App />
              </Router>
            </NotificationContextProvider>
          </BlogContextProvider>
        </UserContextProvider>
      </LoginContextProvider>
    </QueryClientProvider>
  </StrictMode>
)
