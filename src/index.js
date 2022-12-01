import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'pdfjs-dist/web/pdf_viewer.css';
import {register} from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

register()
