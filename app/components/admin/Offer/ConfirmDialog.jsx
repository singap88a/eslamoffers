import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 relative animate-fadeIn border border-gray-200">
        <div className="flex flex-col items-center mb-4">
          <FiAlertTriangle className="text-4xl text-red-500 mb-2" />
          <h3 className="text-xl font-extrabold mb-2 text-center text-[#14b8a6] drop-shadow-sm">تأكيد الحذف</h3>
        </div>
        <p className="mb-6 text-center text-gray-700 font-semibold">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition font-bold shadow cursor-pointer border border-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            إلغاء
          </button>
          <button
            className="bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200 transition font-bold shadow disabled:opacity-60 cursor-pointer border border-red-200"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "جاري الحذف..." : "حذف"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 