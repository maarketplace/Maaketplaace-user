import { createBrowserRouter } from 'react-router-dom';
import LazyImport from './LazyImport';

const LoginLoader = () => import('./components/onboarding/login');

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyImport componentLoader={LoginLoader} />,
    loader: LoginLoader,
  },
]);


export default router;
