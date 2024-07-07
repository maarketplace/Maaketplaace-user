import { createBrowserRouter } from 'react-router-dom';
import LazyImport from './LazyImport';
import UserSignupForm from './components/onboarding/signup';

const LoginLoader = () => import('./components/onboarding/login');

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyImport componentLoader={LoginLoader} />,
    loader: LoginLoader,
  },
  {
    path: '/create-account',
    element: <UserSignupForm />
}
]);


export default router;
