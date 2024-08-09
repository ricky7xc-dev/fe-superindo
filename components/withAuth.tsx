'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ComponentType } from 'react';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const [isClient, setIsClient] = useState(false);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);
    const role = useSelector((state: RootState) => state.auth.role);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
      setIsClient(true);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, role, router]);

    const handleLogout = () => {
      dispatch(logout());
      router.push('/login');
    };

    if (!isClient || !isAuthenticated) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <WrappedComponent {...props} />
        {/* <button onClick={handleLogout}>Logout</button> */}
      </div>
    );
  };

  return AuthComponent;
};

export default withAuth;
