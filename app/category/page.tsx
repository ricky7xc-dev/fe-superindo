'use client';

import ProductCategories from './ProductCategories';
import withAuth from '../../components/withAuth';

const Page = () => {
  return (
    <>
      <div className="relative overflow-x-auto">
        <ProductCategories />
      </div>
    </>
  );
}

export default withAuth(Page);
