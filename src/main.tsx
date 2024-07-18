import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { RecoilRoot } from 'recoil';
import { ErrorBoundary, Message } from 'tilty-ui';

import Router from '@/router';

import '@/scripts/axios';
import 'tilty-ui/dist/theme/global.less';
import 'tilty-ui/dist/theme/index.less';
import 'tilty-ui/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/global.less';

declare global {
  interface Window {
    clientAccessToken: string;
    buildVersion: string;
  }
}

window.buildVersion = '1.0.1-OpenSource';

const root = document.getElementById('app');

document.addEventListener('DOMContentLoaded', () => {
  root &&
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <RecoilRoot>
          <ErrorBoundary>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <Message />
          </ErrorBoundary>
        </RecoilRoot>
      </React.StrictMode>,
    );
});
