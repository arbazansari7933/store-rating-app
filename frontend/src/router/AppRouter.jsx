import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import OwnerDashboard from '../pages/OwnerDashboard';
import ChangePassword from '../pages/ChangePassword';
import AppLayout from '../layouts/AppLayout';

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'OWNER') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<HomeRedirect />} />
      <Route element={<AppLayout />}>
        <Route
          path="/admin"
          element={
            <Protected roles={['ADMIN']}>
              <AdminDashboard />
            </Protected>
          }
        />
        <Route
          path="/stores"
          element={
            <Protected roles={['USER']}>
              <UserDashboard />
            </Protected>
          }
        />
        <Route
          path="/owner"
          element={
            <Protected roles={['OWNER']}>
              <OwnerDashboard />
            </Protected>
          }
        />
        <Route
          path="/change-password"
          element={
            <Protected>
              <ChangePassword />
            </Protected>
          }
        />
      </Route>
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
