import React from "react";

const ConfirmModal = ({ isOpen, onClose, title, modalFn, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop: Faded and Blurred */}
      <div
        className="fixed inset-0 bg-black/10 bg-opacity-40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* ConfirmModal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-black/50 rounded-2xl p-6 shadow-xl w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
          {/* Header */}
          {title && <h2 className="font-semibold mb-4 text-bone">{title}</h2>}

          {/* Body */}
          <div className="text-gray-600 mb-4">{children}</div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1 border border-gray-700 text-sm cursor-pointer rounded-xs bg-gray-900 text-white hover:bg-gray-900 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
