"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchVwCart } from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";

export default function Page() {
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.auth.user);
  const user_id = user?.id || 1;

  const { data, status, current_page, last_page, links } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchVwCart({userId: user_id}));
  }, []);

  const totalOverallAmount = data.reduce((total, category) => {
    return total + parseFloat(category.total_amount);
  }, 0);

  return (
    <>
      <div className="">
        <div className="text-4xl w-full text-center">Your Cart</div>
        <div className="relative overflow-x-auto mt-10">
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
                  Price
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

          <dl className="w-[40%] text-gray-900 divide-y divide-gray-200 float-right">
            <div className="flex flex-col pb-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 truncate">
                    Sub Total
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                  {totalOverallAmount}
                </div>
              </div>
            </div>
            <div className="flex flex-col pb-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 truncate">
                    Pajak & Biaya Pengiriman
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                  12000
                </div>
              </div>
            </div>
            <div className="flex flex-col pb-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 truncate">
                    Total Akhir
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                  {totalOverallAmount + 12000}
                </div>
              </div>
            </div>
          </dl>
        </div>
        <div className="w-full text-right">
          <a
            href="/checkout"
            className="text-white bg-[#17A2B8] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-12 py-2 text-center"
          >
            Checkout
          </a>
        </div>
      </div>
    </>
  );
}
