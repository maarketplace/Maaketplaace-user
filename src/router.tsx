import { createBrowserRouter } from 'react-router-dom';
import LazyImport from './LazyImport';
import Signup from './components/onboarding/signup';
import Home from './components/pages';
import Product from './components/pages/product';

const LoginLoader = () => import('./components/onboarding/login');

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyImport componentLoader={LoginLoader} />,
    loader: LoginLoader,
  },
  {
    path: '/create-account',
    element: <Signup />
  },
  {
    path: 'home',
    element: <Home/>,
    children: [
      {
        path: '',
        element: <Product/>
      },
      {
        path: 'home/quicks'
      },
      {
        path: 'home/dashboard'
      }
    ]
  }
]);


export default router;
