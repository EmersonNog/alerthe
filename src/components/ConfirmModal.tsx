interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/20 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6 space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          Confirmar exclusão
        </h3>
        <p className="text-sm sm:text-base text-gray-600">{message}</p>
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
