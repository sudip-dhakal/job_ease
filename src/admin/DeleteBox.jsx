export default function DeleteBox({ setIsOpen, handleDelete }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
          <p className="text-gray-800 text-lg font-semibold">Are you sure you want to delete this?</p>
          <div className="flex justify-between mt-4">
            <button
              className="text-white bg-red-700 rounded-md px-4 py-2 transition-all duration-300 hover:bg-red-500"
              onClick={() => {
                handleDelete();
                setIsOpen(false);
              }}
            >
              Delete
            </button>
            <button
              className="text-white bg-blue-700 rounded-md px-4 py-2 transition-all duration-300 hover:bg-blue-500"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  