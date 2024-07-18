import { Navigate, Route, Routes } from 'react-router-dom';

import InteractiveMap from '@/pages/InteractiveMap';
import Notfound from '@/pages/NotFound';
import LayoutBase from '@/components/Layout/base';

const Router = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="interactive" />} />
      <Route path="/" element={<LayoutBase />}>
        <Route path="interactive" element={<InteractiveMap />} />
      </Route>
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
};

export default Router;
