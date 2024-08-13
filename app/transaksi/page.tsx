// pages/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import ProductCard from "../../components/ProductCard";

import { fetchProductVariant } from "../../redux/slices/productVariantSlice";

export default function Page() {
  const dispatch = useAppDispatch();
  const { data, status, current_page, last_page, links, editingCategory } =
    useSelector((state: RootState) => state.productVariants);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component has mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePageChange = (page: number) => {
    console.log(`Requested page change to: ${page}`);
    if (page >= 1 && page <= last_page) {
      dispatch(fetchProductVariant(page));
    }
  };

  useEffect(() => {
    console.log(`Loading page: ${current_page}`);
    dispatch(fetchProductVariant(current_page));
  }, [dispatch, current_page]);

  // Render a consistent UI on the server
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {isAuthenticated && user ? (
            data.map((product, index) => (
              <ProductCard
                key={index}
                imageSrc={
                  process.env.NEXT_PUBLIC_API_URL +
                  "/storage/" +
                  product.image_location
                }
                title={product.name}
                price={product.price}
                qty={product.qty}
                userId={user.id}
                productId={product.id}
              />
            ))
          ) : (
            <div>Please log in to add items to your cart.</div>
          )}
        </div>
      </div>
      <div className="w-full text-center">
        <nav
          className="flex items-center justify-between pt-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500">
            Showing page {current_page} of {last_page}
          </span>
          <ul className="inline-flex items-center -space-x-px text-sm h-8">
            {links.map((link, index) => {
              // Ensure `link.url` is used to determine the page number
              const pageNumber = link.url
                ? parseInt(new URL(link.url).searchParams.get("page") || "1")
                : index + 1;
              return (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={!link.url || link.active}
                    className={`flex items-center justify-center px-3 h-8 leading-tight ${
                      link.active
                        ? "text-blue-600 border border-gray-300 bg-blue-50"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {link.label.replace(/&laquo;|&raquo;/g, "")}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
