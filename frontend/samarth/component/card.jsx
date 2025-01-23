export default function Card({ statement, query, date }) {
  return (
    <div className="max-w-sm mx-auto my-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Statement</h2>
        <p className="text-sm text-gray-600">{statement}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-800">Query</h3>
        <p className="text-sm text-gray-600">{query}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
