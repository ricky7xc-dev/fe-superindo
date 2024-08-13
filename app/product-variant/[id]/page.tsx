"use client";
import { fetchProductVariantId } from '@/redux/slices/productVariantSlice';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { RootState, useAppDispatch } from "../../../redux/store";

const ProductVariantPage: React.FC = () => {
  const { id } = useParams(); // Mengambil id dari URL
  const dispatch = useAppDispatch();
  const { data, status, current_page, last_page, links } = useSelector(
    (state: RootState) => state.productVariants
  );

  useEffect(() => {
    if (id) {
      const productId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
      if (!isNaN(productId)) {
        // Fetch data berdasarkan id dan halaman pertama (default 1)
        dispatch(fetchProductVariantId({ productId, page: 1 }));
      }
    }
  }, [id, dispatch]);

  const handlePageChange = (page: number) => {
    console.log(`Requested page change to: ${page}`);
    if (id) {
      const productId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
      if (!isNaN(productId) && page >= 1 && page <= last_page) {
        // Fetch data berdasarkan id dan halaman yang dipilih
        dispatch(fetchProductVariantId({ productId, page }));
      }
    }
  };

  return (
    <div>
      <h1>Variants for Product ID: {id}</h1>
      {/* Render variant data here */}
      <div className="relative overflow-x-auto ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Code
              </th>
              <th scope="col" className="px-6 py-3">
                Nama
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {status === "succeeded" && data.length > 0 ? (
              data.map((category) => (
                <tr className="bg-white border-b" key={category.id}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {category.code}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {category.name}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {category.price}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {category.qty}
                  </th>
                  <td className="px-6 py-4">
                    {category.active ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      // onClick={() => handleEditClick(category)}
                      className="font-medium text-blue-600 hover:underline px-1"
                    >
                      Edit
                    </button>
                    <button
                      // onClick={() => handleDelete(category.id)}
                      className="font-medium text-red-600 hover:underline px-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    </div>
  );
};

export default ProductVariantPage;
