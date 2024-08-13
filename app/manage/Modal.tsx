// components/Modal.tsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { fetchProductCategoriesAll } from "../../redux/slices/productCategoriesSlice";

import {
  addProduct,
  clearMessages,
  updateProduct,
} from "../../redux/slices/productSlice";
import { fetchCart, fetchVwCart, fetchVwInvoice } from "@/redux/slices/cartSlice";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const editingCategory = useSelector(
    (state: RootState) => state.invoice.editingCategory
  );
  const { data, status, current_page, last_page, links } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    if (editingCategory?.user_id !== undefined) {
      console.log(`Loading page: ${current_page}`);
      dispatch(fetchVwInvoice({ userId: editingCategory.user_id }));
    } else {
      console.warn("User ID is undefined");
    }
  }, [dispatch, current_page, editingCategory]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Detail {editingCategory?.code}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="px-4">
              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Nama :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {editingCategory?.first_name +
                      " " +
                      editingCategory?.last_name}
                  </div>
                </div>
              </div>

              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Alamat :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {editingCategory?.address}
                  </div>
                </div>
              </div>

              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Nmr Handphone :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {editingCategory?.phone_number}
                  </div>
                </div>
              </div>

              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Email :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {editingCategory?.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Tanggal Pembelian :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {editingCategory?.created_date}
                  </div>
                </div>
              </div>

              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Total Pembelian :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {isNaN(Number(editingCategory?.total_amount))
                      ? "Invalid amount"
                      : Number(editingCategory?.total_amount) + 12000}
                  </div>
                </div>
              </div>

              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Metode Pembayaran :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {editingCategory?.payment_method}
                  </div>
                </div>
              </div>

              <div className="flex flex-col pb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      Bukti Pembayaran :
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    <img
                      className="rounded-t-lg w-full h-48 object-contain"
                      src={
                        process.env.NEXT_PUBLIC_API_URL +
                        "/storage/" +
                        editingCategory?.payment_proof
                      }
                      alt="product image"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full font-bold text-center mb-2">Barang</div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-s-lg">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Qty
                </th>
                <th scope="col" className="px-6 py-3 rounded-e-lg">
                  Price Total
                </th>
              </tr>
            </thead>
            <tbody>
              {status === "succeeded" && data.length > 0 ? (
                data.map((category) => (
                  <tr className="bg-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {category.name}
                    </th>
                    <td className="px-6 py-4">{category.total_quantity}</td>
                    <td className="px-6 py-4">{category.total_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    No data available
                  </td>
                </tr>
              )}
              <tr className="bg-white">
                    <th
                      scope="row"
                      className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap"
                    >
                      + Pajak & Pengiriman
                    </th>
                    <td className="px-6 py-4"> </td>
                    <td className="px-6 py-4">12000</td>
                  </tr>
            </tbody>
            {/* <tfoot>
              <tr className="font-semibold text-gray-900">
                <th scope="row" className="px-6 py-3 text-base">
                  Total
                </th>
                <td className="px-6 py-3">3</td>
                <td className="px-6 py-3">21,000</td>
              </tr>
            </tfoot> */}
          </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
