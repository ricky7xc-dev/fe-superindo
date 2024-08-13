'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { useRouter } from 'next/navigation';

const ProtectedPage = ({ children, requiredRole }: { children: React.ReactNode; requiredRole: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Simulate checking auth status or fetching user role if needed
      if (!isAuthenticated) {
        router.push('/login');
      } else if (role !== requiredRole) {
        router.push('/transaksi'); // Redirect if role does not match
      } else {
        setLoading(false); // Only set loading to false if the user is authorized
      }
    };

    checkAuth();
  }, [isAuthenticated, role, requiredRole, router]);

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while auth is being checked
  }

  return <>{children}</>;
};

export default ProtectedPage;
