"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { fetchCart } from "@/redux/slices/cartSlice";

const Navbar = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const cart = useSelector((state: RootState) => state.cart);
  const { data, status, current_page, last_page, links } = useSelector(
    (state: RootState) => state.cart
  );

  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log(`Loading page: ${current_page}`);
    dispatch(fetchCart(current_page));
  }, []);

  return (
    <nav className="bg-gray-100 border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3">
          <img
            // src="https://flowbite.com/docs/images/logo.svg"
            src="https://www.superindo.co.id/images/new/logo-superindo.png"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Superindo
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0">
          {isClient && isAuthenticated ? (
            <>
              {user && (
                <div className="content-center px-2">Hi, {user.name}</div>
              )}
              <div className="flex">
                <li className="font-sans block lg:inline-block mx-3 align-middle text-black hover:text-gray-700">
                  <a href="/cart" role="button" className="relative flex">
                    <svg
                      className="flex-1 w-8 h-8 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                    </svg>
                    <span className="absolute right-0 top-0 rounded-full bg-red-600 w-4 h-4 top right p-0 m-0 text-white font-mono text-sm  leading-tight text-center">
                      {cart.total}
                    </span>
                  </a>
                </li>
              </div>
              <button
                onClick={handleLogout}
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              Login
            </a>
          )}
        </div>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            {isClient && isAuthenticated && user?.role == "admin" && (
              <>
                <li>
                  <a
                    href="/"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                    aria-current="page"
                  >
                    Halaman Utama
                  </a>
                </li>
                <li>
                  <a
                    href="/product"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    Produk
                  </a>
                </li>
                <li>
                  <a
                    href="/category"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    Kategori
                  </a>
                </li>
                <li>
                  <a
                    href="/manage"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    Manajemen
                  </a>
                </li>
              </>
            )}

            {isClient && isAuthenticated && user?.role == "user" && (
              <>
                <li>
                  <a
                    href="/transaksi"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    Transaksi
                  </a>
                </li>
                <li>
                  <a
                    href="/orders"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    Histori Pembelian
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
