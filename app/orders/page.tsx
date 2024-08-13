"use client";
import { fetchInvoice, getInvoice, setDetailInvoice } from "@/redux/slices/invoiceSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { InvoiceVariant } from "@/redux/types";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Modal from "./Modal";

export default function Page() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user_id = user?.id || 1;
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, current_page, last_page, links } = useSelector(
    (state: RootState) => state.invoice
  );

  useEffect(() => {
    dispatch(getInvoice({ userId: user_id }));
  }, [dispatch, user_id]);

  const handlePageChange = (page: number) => {
    console.log(`Requested page change to: ${page}`);
    if (page >= 1 && page <= last_page) {
      dispatch(getInvoice({ userId: user_id, page }));
    }
  };

  const handleEditClick = (category: InvoiceVariant) => {
    dispatch(setDetailInvoice(category));
    console.log(category);
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    dispatch(setDetailInvoice(null));
  };

  return (
    <>
      <div className="relative overflow-x-auto ">
        <Modal isOpen={isModalOpen} onClose={toggleModal} />
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID Transaksi
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3">
                Jumlah
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Detail</span>
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
                  <td className="px-6 py-4">{category.created_date}</td>
                  <td className="px-6 py-4">
                    {isNaN(Number(category.total_amount))
                      ? "Invalid amount"
                      : Number(category.total_amount) + 12000}
                  </td>

                  <td className="px-6 py-4">{category.status}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="font-medium text-blue-600 hover:underline px-1"
                    >
                      Detail
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
}
