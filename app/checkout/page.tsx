"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchVwCart } from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { createInvoice } from "@/redux/slices/invoiceSlice";
import Swal from "sweetalert2";
import { uploadImage } from "../../redux/slices/imageSlice";

export default function Page() {
  const cart = useSelector((state: RootState) => state.cart);
  const { data, status, current_page, last_page, links } = useSelector(
    (state: RootState) => state.cart
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "";
  const user_id = user?.id || 1;
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [payment_proof, setPaymentProof] = useState("");
  const [payment_method, setPaymentMethod] = useState("bank_transfer");
  const router = useRouter();

  const { loading, success, error } = useSelector(
    (state: RootState) => state.invoice
  );

  useEffect(() => {
    setIsClient(true);
    console.log(`Loading page: ${current_page}`);
    dispatch(fetchVwCart(current_page));
  }, []);

  const totalOverallAmount = data.reduce((total, category) => {
    return total + parseFloat(category.total_amount);
  }, 0);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    // dispatch(setEditingProduct(null));
  };
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file as Blob);
    const uploadResult = await dispatch(uploadImage(formData)).unwrap();
  
    const userId = user_id; // Replace with appropriate value
    const firstName = first_name; // Replace with input value
    const lastName = last_name; // Replace with input value
    const addressSub = address; // Replace with input value
    const phoneNumber = phone_number; // Replace with input value
    const emailSub = email; // Replace with input value
    const paymentProof = uploadResult; // Replace with input or upload value
    const paymentMethod = payment_method; // Replace with input value
    const created_user = userName; // Replace with value from state or session
  
    try {
      const resultAction = await dispatch(
        createInvoice({
          userId,
          firstName,
          lastName,
          addressSub,
          phoneNumber,
          emailSub,
          paymentProof,
          paymentMethod,
          created_user,
        })
      );
  
      const result = resultAction.payload as { success: boolean; error?: string }; // Type assertion if needed
  
      if (result.success) {
        // Show success alert
        await Swal.fire({
          title: 'Success!',
          text: 'Invoice created successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        router.push('/orders'); // Navigate to /transaksi on success
      } else {
        // Show error alert
        Swal.fire({
          title: 'Error!',
          text: result.error || 'Failed to create invoice.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      // Handle unexpected errors
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <>
      <div className="">
        <div className="text-4xl w-full text-center">Checkout Pembelian</div>
        <Modal isOpen={isModalOpen} onClose={toggleModal} />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="col-span-2 block p-6 bg-white border border-gray-200 rounded-lg shadow">
              <div className="text-lg font-bold">Alamat Pengiriman</div>
              <div className="grid md:grid-cols-2 md:gap-6 mt-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Nama Awal
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Nama Akhir
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Alamat Pengiriman
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder=""
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6 mt-4">
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Nomor Handphone
                  </label>
                  <input
                    type="text"
                    id="phone_number"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
              <div className="text-lg font-bold">Metode Pembayaran</div>
              <div className="mx-auto mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Pilih metode pembayaran
                </label>
                <select
                  id="payment_method"
                  value={payment_method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="bank_transfer">Transfer Bank</option>
                  <option value="cod">COD</option>
                  <option value="qris">QRIS</option>
                  <option value="ewallet">Dompet Digital</option>
                </select>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="image"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Upload Bukti Pembayaran
                </label>
                <input type="file" onChange={handleFileChange} />
              </div>
            </div>
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow h-max">
              <div className="text-lg font-bold">Order Summary</div>
              <hr className="h-[2px] mx-auto bg-black border-0 rounded my-2"></hr>
              <div className="flex items-center space-x-4 my-2">
                <div className="flex-1 min-w-0">
                  <p className="text-md font-medium text-gray-900 truncate">
                    Sub Total :
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-medium text-gray-900">
                  {totalOverallAmount}
                </div>
              </div>
              <div className="flex items-center space-x-4 my-2">
                <div className="flex-1 min-w-0">
                  <p className="text-md font-medium text-gray-900 truncate">
                    Pajak & Biaya Pengiriman :
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-medium text-gray-900">
                  12000
                </div>
              </div>
              <hr className="h-[2px] mx-auto bg-black border-0 rounded my-2"></hr>
              <div className="flex text-center justify-center">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  Total Akhir : {totalOverallAmount + 12000}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full text-right mt-12">
            <button
              // onClick={toggleModal}
              type="submit"
              className="text-white bg-[#17A2B8] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-12 py-2 text-center"
            >
              Bayar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
