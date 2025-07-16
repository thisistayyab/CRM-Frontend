import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ThemeCustomization from './themes';
import ScrollTop from './Components/ScrollTop.jsx';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Analytics />
    <ThemeCustomization>
      <ScrollTop>
        <App />
      </ScrollTop>
    </ThemeCustomization>
  </StrictMode>,
)
