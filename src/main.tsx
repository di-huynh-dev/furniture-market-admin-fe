import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './providers/ThemeProvider.tsx'
import AppProviders from './providers/AppProviders.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <AppProviders>
    <App />
  </AppProviders>,
  // </ThemeProvider>,
)
