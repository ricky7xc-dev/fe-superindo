'use client';

import Products from './Products';
import withAuth from '../../components/withAuth';

const Page = () => {
  return (
    <>
      <div className="relative overflow-x-auto w-full">
        <Products />
      </div>
    </>
  );
}

export default withAuth(Page);
