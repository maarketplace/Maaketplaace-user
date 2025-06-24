import { createBrowserRouter } from 'react-router-dom';
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
import ResetPassword from './components/onboarding/resetpassword';
import ForgotPassword from './components/onboarding/forgetpassword';
import OrderFailure from './components/pages/orderSuccessful/OrderFailure';
import OrderSummaryDetails from './components/pages/orderSummary/OrderSummary';
import FreeOrderSuccess from './components/pages/orderSuccessful/FreeProductOrderSuccess';
import Event from './components/pages/events';
import EventDetails from './components/pages/events/index[id]';
// eslint-disable-next-line react-refresh/only-export-components
const LoginLoader = () => import('./components/onboarding/login');
// eslint-disable-next-line react-refresh/only-export-components
const ProductPage = lazy(() => import('./components/pages/product'));
const router = createBrowserRouter([
  {
    path: '/login',
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
    path: '/',
    element: <Home />,
    children: [
      {
        path: '',
        element:
          <Suspense fallback={<div>Loading...</div>}>
              <ProductPage />
          </Suspense>
      },
      {
        path: '/details/:id',
        element: <Details />
      },
      {
        path: '/quicks',
        element: <Quicks />
      },
      {
        path: 'comments/:id',
        element: <Comment productId={''} />
      },
      {
        path: 'dashboard'
      },
      {
        path: 'store/:businessName',
        element: <Store />
      },
      {
        path: 'search',
        element: <Search />
      },
      {
        path: 'order-success',
        element: <OrderSuccess />
      },
      {
        path: 'order-summary',
        element: <OrderSummary />
      },
      {
        path: 'free-order-summary',
        element: <FreeOrderSuccess />
      },
      {
        path: 'order-summary/:refrence',
        element: <OrderSummaryDetails />
      },
      {
        path: 'order-failure',
        element: <OrderFailure />
      },
      {
        path: 'events',
        element: <Event />
      },
      {
        path: 'event-details/:id',
        element: <EventDetails />
      }
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

