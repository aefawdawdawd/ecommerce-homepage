import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const DeleteConfirm = ({ isOpen, onClose, onConfirm, loading }) => {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = () => {
    if (confirmText === 'DELETE') {
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-xl font-light">Delete Account</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-gray-600 mb-2">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <p className="text-sm text-gray-500">
                Please type <span className="font-mono font-bold">DELETE</span> to confirm
              </p>
            </div>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 text-center font-mono"
            />

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirmText !== 'DELETE' || loading}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirm;