// components/Modal.tsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";

import {
  addProductVariant,
  clearMessages,
} from "../../redux/slices/productVariantSlice";
import { uploadImage } from "../../redux/slices/imageSlice";

interface ModalVariantProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalVariant: React.FC<ModalVariantProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const editingCategory = useSelector(
    (state: RootState) => state.productVariants.editingCategory
  );
  const { loading, success, error } = useSelector(
    (state: RootState) => state.productVariants
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "";
  const idProduct = editingCategory?.id || 0;

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(0);
  const [active, setActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const imageLocation = useSelector(
    (state: RootState) => state.image.imageLocation
  );
  const imageUploadLoading = useSelector(
    (state: RootState) => state.image.loading
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (editingCategory) {
      setCode("");
      setName("");
      setActive(true);
    } else {
      setCode("");
      setName("");
      setActive(true);
    }
  }, [editingCategory]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file as Blob);

    // Unggah gambar dan dapatkan imageLocation
    const uploadResult = await dispatch(uploadImage(formData)).unwrap();
    if (editingCategory) {
      dispatch(
        addProductVariant({
          code,
          name,
          price,
          image_location: uploadResult,
          product_id: idProduct,
          qty,
          active,
          created_user: userName,
        })
      );
    } else {
      // Create new category
      dispatch(
        addProductVariant({
          code,
          name,
          price,
          image_location: uploadResult,
          product_id: idProduct,
          qty,
          active,
          created_user: userName,
        })
      );
    }
    // onClose();
  };

  useEffect(() => {
    if (success || error) {
      setTimeout(() => {
        dispatch(clearMessages());
        onClose();
      }, 500);
    }
  }, [success, error, dispatch, onClose]);

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert the string to a number before updating the state
    setQty(parseFloat(e.target.value) || 0); // Use parseInt if you want an integer
  };

  const handleUploadImage = () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(uploadImage(formData));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingCategory
                  ? "Tambah Variant Produk " + editingCategory.name
                  : "Create New Product"}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
            <form onSubmit={handleSubmit} className="p-4 md:p-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="code"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="qty"
                    value={qty}
                    onChange={handleQtyChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Harga
                  </label>
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Gambar
                  </label>
                  {/* <input
                    type="text"
                    id="image_location"
                    value={imageLocation}
                    onChange={(e) => setImageLocation(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  /> */}
                  <input type="file" onChange={handleFileChange} />
                </div>
                <div>
                  <label
                    htmlFor="active"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>
                  <select
                    id="active"
                    value={active ? "true" : "false"}
                    onChange={(e) => setActive(e.target.value === "true")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-12 py-2 text-center"
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-12 py-2 text-center"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {loading && <p className="text-gray-500">Processing...</p>}
              {success && <p className="text-green-500">{success}</p>}
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalVariant;
