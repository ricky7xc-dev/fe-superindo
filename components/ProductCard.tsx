// components/ProductCard.tsx

import React from "react";

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  title,
  price,
}) => {
  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
        <a href="#">
          <img
            className="p-2 rounded-t-lg w-full h-32"
            src={imageSrc}
            alt="product image"
          />
        </a>
        <div className="px-5 pb-5">
          <a href="#">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900">
              {title}
            </h5>
          </a>
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between">
            <span className="text-3xl font-bold text-gray-900">{price}</span>
            <a
              href="#"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Add to cart
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
