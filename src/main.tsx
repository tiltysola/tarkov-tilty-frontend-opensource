import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { RecoilRoot } from 'recoil';
import { Message } from 'tilty-ui';

import Router from '@/router';

import '@/scripts/axios';
import '@/global.less';
import 'tilty-ui/dist/theme/global.less';
import 'tilty-ui/dist/theme/index.less';
import 'tilty-ui/dist/style.css';

declare global {
  interface Window {
    buildVersion: string;
  }
}

window.buildVersion = '1.0.0-OpenSource';

const root = document.getElementById('app');

document.addEventListener('DOMContentLoaded', () => {
  root &&
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <RecoilRoot>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
          <Message />
        </RecoilRoot>
      </React.StrictMode>,
    );
});
