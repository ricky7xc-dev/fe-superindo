"use client";
import { useState, useEffect } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { login } from "../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {
  const [username, setUsername] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status, error, isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && role == "admin") {
      router.push("/");
    } else if (isAuthenticated && role == "user") {
      router.push("/transaksi");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }) as any);
  };

  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </h1>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Your role
                  </label>
                  <input
                    type="text"
                    name="role"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Enter role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div> */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <button
                  // onClick={handleLogin}
                  type="submit"
                  className="w-full text-white bg-gray-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-12"
                >
                  Sign in
                </button>
                {status === "loading" && <p>Loading...</p>}
                {status === "failed" && <p>{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
