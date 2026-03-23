import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: Props) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        style={{ animation: "fdIn 0.15s ease-out" }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-xl"
        style={{
          backgroundColor: "var(--color-white, hsl(var(--background)))",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)",
          animation: "scIn 0.15s ease-out",
        }}
      >
        <div className="p-5">
          {/* Header: icon + title */}
          <div className="flex items-start gap-3.5 mb-3">
            <div
              className="shrink-0 mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.18)",
              }}
            >
              <Trash2 className="text-red-500" size={16} strokeWidth={2} />
            </div>
            <div>
              <h2
                className="text-[15px] font-semibold leading-snug"
                style={{ color: "var(--color-text-dark, hsl(var(--foreground)))" }}
              >
                {title}
              </h2>
              <p
                className="text-sm mt-1 leading-relaxed"
                style={{ color: "var(--color-text-gray, hsl(var(--muted-foreground)))" }}
              >
                {message}
              </p>
            </div>
          </div>

          {/* Item name — flagged catalog entry */}
          {itemName && (
            <div
              className="mb-4 px-3 py-2 rounded-md text-sm font-medium truncate"
              style={{
                backgroundColor: "rgba(239,68,68,0.04)",
                borderLeft: "3px solid rgba(239,68,68,0.35)",
                color: "var(--color-text-dark, hsl(var(--foreground)))",
              }}
            >
              {itemName}
            </div>
          )}

          {!itemName && <div className="mb-4" />}

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-9 px-4 rounded-md text-sm font-medium text-white
                         bg-red-500 hover:bg-red-600 active:bg-red-700
                         transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-3.5 w-3.5 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 size={13} strokeWidth={2.5} />
                  Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fdIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scIn  { from { opacity: 0; transform: scale(0.97) translateY(4px) } to { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>
  );
};
