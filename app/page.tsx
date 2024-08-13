import ProtectedPage from "@/components/ProtectedPage";

export default function Home() {
  return (
    <ProtectedPage requiredRole="admin">
      <div className="grid grid-cols-4 gap-4">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Total Product
          </h5>
          <p className="font-normal text-gray-700">1234</p>
        </div>
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Total Transaksi
          </h5>
          <p className="font-normal text-gray-700">567</p>
        </div>
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Total Variant
          </h5>
          <p className="font-normal text-gray-700">8910</p>
        </div>
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Total User
          </h5>
          <p className="font-normal text-gray-700">2</p>
        </div>
      </div>
      <div className="w-full">
      </div>
    </ProtectedPage>
  );
}
