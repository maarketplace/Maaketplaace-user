import { createHashRouter } from 'react-router-dom';
import LazyImport from './LazyImport';
import Signup from './components/onboarding/signup';
import Home from './components/pages';
import Product from './components/pages/product';
import Details from './components/pages/details';
import Quicks from './components/pages/quicks';
import Verify from './components/onboarding/verify';
import Comment from './components/pages/comment';
import Store from './components/pages/store';

const LoginLoader = () => import('./components/onboarding/login');

const router = createHashRouter([
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
    path: '/verify',
    element: <Verify />
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
        path: '/home/details/:id',
        element: <Details/>
      },
      {
        path: '/home/quicks',
        element: <Quicks/>
      },
      {
        path: '/home/comments/:id',
        element: <Comment/>
      },
      {
        path: '/home/dashboard'
      },
      {
        path: '/home/store/:id/name',
        element: <Store/>
      }
    ]
  }
]);


export default router;
