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
import Search from './components/pages/search';
import Dashaboard from './components/dashboard';
import Overview from './components/dashboard/overview';
import Order from './components/dashboard/order';
import Books from './components/dashboard/books';

// eslint-disable-next-line react-refresh/only-export-components
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
    element: <Home />,
    children: [
      {
        path: '',
        element: <Product />
      },
      {
        path: '/home/details/:id',
        element: <Details />
      },
      {
        path: '/home/quicks',
        element: <Quicks />
      },
      {
        path: '/home/comments/:id',
        element: <Comment />
      },
      {
        path: '/home/dashboard'
      },
      {
        path: '/home/store',
        element: <Store />
      },
      {
        path: '/home/search',
        element: <Search />
      },
    ]
  },
  {
    path: 'dashboard',
    element: <Dashaboard />,
    children: [
      {
        path: '',
        element: <Overview />
      },
      {
        path: '/dashboard/order',
        element: <Order />
      },
      {
        path: '/dashboard/books',
        element: <Books />
      },
      {
        path: '/dashboard/books/:id',
        element: <Books />
      },
    ]
  }
]);


export default router;

