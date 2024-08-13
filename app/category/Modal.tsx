// components/Modal.tsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  addProductCategory,
  clearMessages,
  updateProductCategory,
} from "../../redux/slices/productCategoriesSlice";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const editingCategory = useSelector(
    (state: RootState) => state.productCategories.editingCategory
  );
  const { loading, success, error } = useSelector(
    (state: RootState) => state.productCategories
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "";

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setActive(editingCategory.active);
    } else {
      setName("");
      setActive(true);
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingCategory) {
      // Update existing category
      dispatch(
        updateProductCategory({
          id: editingCategory.id,
          name,
          active,
          updated_user: userName,
        })
      );
    } else {
      // Create new category
      dispatch(addProductCategory({ name, active, created_user: userName }));
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory
                  ? "Edit Product Category"
                  : "Create New Product Category"}
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
            <form onSubmit={handleSubmit} className="p-4 md:p-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="active"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Status
                  </label>
                  <select
                    id="active"
                    value={active ? "true" : "false"}
                    onChange={(e) => setActive(e.target.value === "true")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
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
                    {editingCategory ? "Update" : "Add"}
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

export default Modal;
