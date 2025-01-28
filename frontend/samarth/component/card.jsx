export default function Card({ statement, query, intent, date }) {
  console.log(intent);
  return (
    <div className="max-w-sm mx-auto my-4 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Statement</h2>
        <p className="text-md text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
          {statement}
        </p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Query</h3>
        <p className="text-md text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
          {query}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 italic">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        {["update", "delete", "insert"].includes(intent) ? (
          <button className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Revert
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
