"use client";

import { Inter } from "next/font/google";
import { Provider } from 'react-redux';
import store from '../redux/store';
import Navbar from '../components/Navbar';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Navbar />
          <main>
            <div className="px-2 md:px-4 lg:px-8 py-12 justify-center items-center place-content-center">
              {children}
            </div>
          </main>
        </Provider>
      </body>
    </html>
  );
}
