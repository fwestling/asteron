import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Root, { action as rootAction } from '@/app/root';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from '@/app/error-page';
import UserPage from './app/users/user';
import Signup from './app/auth/signup';
import Login from './app/auth/login';
import AuthTemplate from './app/auth/auth-template';
import { AuthProvider } from './api/AuthProvider';
import ApiProvider from './api/ApiProvider';
import Home from './app/home';
import UserEditPage from './app/users/user/edit';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    action: rootAction,
    element: <Root />,
    children: [
      {
        element: <AuthTemplate />,
        // Authenticated routes
        children: [
          {
            index: true,
            element: <Home />,
          },
          // @todo
          {
            path: 'users',
            element: <div>Users</div>, //<UsersPage />,
          },
          {
            path: 'users/:userId',
            children: [
              {
                index: true,
                element: <UserPage />,
              },
              {
                path: 'edit',
                element: <UserEditPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ApiProvider>
        <RouterProvider router={router} />
      </ApiProvider>
    </AuthProvider>
  </StrictMode>,
);
