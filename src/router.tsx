import { createHashRouter } from 'react-router-dom';
import LazyImport from './LazyImport';
import Signup from './components/onboarding/signup';
import Home from './components/pages';
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
import OrderSuccess from './components/pages/orderSuccessful';
import OrderSummary from './components/pages/orderSummary';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './private-route';
import ResetPassword from './components/onboarding/resetpassword';
import ForgotPassword from './components/onboarding/forgetpassword';
// eslint-disable-next-line react-refresh/only-export-components
const LoginLoader = () => import('./components/onboarding/login');
// eslint-disable-next-line react-refresh/only-export-components
const ProductPage = lazy(() => import('./components/pages/product'));
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
    path: '/userForgotPassword',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password/:id',
    element: <ResetPassword />
  },
  {
    path: 'home',
    element: <Home />,
    children: [
      {
        path: '',
        element:
          <Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          </Suspense>
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
        element: <Comment productId={''} />
      },
      {
        path: '/home/dashboard'
      },
      {
        path: '/home/store/:businessName',
        element: <Store />
      },
      {
        path: '/home/search',
        element: <Search />
      },
      {
        path: '/home/order-success',
        element: <OrderSuccess />
      },
      {
        path: '/home/order-summary',
        element: <OrderSummary />
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

