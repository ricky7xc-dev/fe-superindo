// components/ProductCategories.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  deleteProductCategory,
  fetchProductCategories,
  setEditingProductCategory,
} from "../../redux/slices/productCategoriesSlice";
import Modal from "./Modal";
import { ProductCategory } from "@/redux/types";

const ProductCategories = () => {
  const dispatch = useAppDispatch();
  const { data, status, current_page, last_page, links, editingCategory } =
    useSelector((state: RootState) => state.productCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = (page: number) => {
    console.log(`Requested page change to: ${page}`);
    if (page >= 1 && page <= last_page) {
      dispatch(fetchProductCategories(page));
    }
  };

  const handleEditClick = (category: ProductCategory) => {
    dispatch(setEditingProductCategory(category));
    console.log(category);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log(`Loading page: ${current_page}`);
    dispatch(fetchProductCategories(current_page));
  }, [dispatch, current_page, isModalOpen]);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    dispatch(setEditingProductCategory(null)); // Clear editing category when closing modal
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteProductCategory(id));
    }
  };

  return (
    <>
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
          <div className="relative">
            <button
              type="button"
              onClick={toggleModal}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-12 py-2 text-center"
            >
              Add data
            </button>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={toggleModal} />
        <label className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for items"
          />
        </div>
      </div>
      <div className="relative overflow-x-auto ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama
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
                    {category.name}
                  </th>
                  <td className="px-6 py-4">
                    {category.active ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="font-medium text-blue-600 hover:underline px-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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
    </>
  );
};

export default ProductCategories;
