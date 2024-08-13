// components/ProductCard.tsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../redux/slices/cartSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RootState, useAppDispatch, AppDispatch } from "../redux/store";

interface ProductCardProps {
  userId: number;
  productId: number;
  imageSrc: string;
  title: string;
  price: string;
  qty: number;
}

const MySwal = withReactContent(Swal);

const ProductCard: React.FC<ProductCardProps> = ({
  userId,
  productId,
  imageSrc,
  title,
  price,
  qty,
}) => {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch to get the correct dispatch type
  const { loading } = useSelector((state: RootState) => state.cart);

  const handleAddToCart = async () => {
    try {
      const { value: quantity } = await Swal.fire({
        title: 'Enter quantity',
        input: 'number',
        inputLabel: 'Quantity',
        inputPlaceholder: 'Enter the quantity',
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
        confirmButtonText: 'Add to cart',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value || Number(value) <= 0) {
            return 'Please enter a valid quantity.';
          }
          return null;
        },
      });

      if (quantity) {
        // Ensure quantity is a number
        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
          throw new Error('Invalid quantity.');
        }

        // Dispatch the addToCart action with the specified quantity
        await dispatch(addToCart({ userId, productId, quantity: parsedQuantity })).unwrap();
        await dispatch(fetchCart(userId)); // Fetch updated cart count

        Swal.fire({
          title: 'Success!',
          text: 'Item added to cart.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add item to cart.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow">
        <a href="#">
          <img
            className="rounded-t-lg w-full h-48 object-contain"
            src={imageSrc}
            alt="product image"
          />
        </a>
        <div className="px-5 pb-5">
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between mb-2 mt-4">
            <a href="#">
              <h5 className="text-lg font-normal tracking-tight text-gray-900">
                {title}
              </h5>
            </a>
            
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">{price}</span>
            <button
              onClick={handleAddToCart}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
