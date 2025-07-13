import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ThemeCustomization from './themes';
import ScrollTop from './Components/ScrollTop.jsx';

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <ThemeCustomization>
      <ScrollTop>
        <App />
      </ScrollTop>
    </ThemeCustomization>
  </StrictMode>,
)
