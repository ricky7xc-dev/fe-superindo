'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import withAuth from '../../components/withAuth';

const ProtectedPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <h1>Protected Page</h1>
      {user && (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default withAuth(ProtectedPage);
