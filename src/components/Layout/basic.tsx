import { Outlet } from 'react-router-dom';

import ErrorBoundary from '../ErrorBoundary';

import './style.less';

const Index = () => {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
};

export default Index;
