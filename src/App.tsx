import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BlankLayout from './layouts/BlankLayout';
import MainLayout from './layouts/MainLayout';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AuthRequire from './routes/AuthRequire';
import HomePage from './pages/HomePage';
import './App.css';
import DetailPage from './pages/DetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthRequire>
        <MainLayout />
      </AuthRequire>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: '/detail', element: <DetailPage /> },
    ],
  },
  {
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
