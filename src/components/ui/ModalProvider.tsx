"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Trash2,
  X,
  HelpCircle,
} from "lucide-react";

export type ModalVariant = "danger" | "warning" | "info" | "success" | "neutral";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface AlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
  variant?: ModalVariant;
  onClose?: () => void;
}

export interface ToastOptions {
  id?: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ModalContextType {
  confirm: (options: ConfirmOptions) => void;
  alert: (options: AlertOptions | string) => void;
  toast: (message: string, type?: "success" | "error" | "info" | "warning") => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);
  const [alertModal, setAlertModal] = useState<AlertOptions | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmModal(options);
  }, []);

  const alert = useCallback((options: AlertOptions | string) => {
    if (typeof options === "string") {
      setAlertModal({
        title: "Notification",
        message: options,
        variant: "info",
      });
    } else {
      setAlertModal(options);
    }
  }, []);

  const toast = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning" = "info", duration = 4000) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    try {
      setIsConfirming(true);
      await confirmModal.onConfirm();
      setConfirmModal(null);
    } catch (err) {
      console.error("[ModalProvider] Confirm action error:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelAction = () => {
    if (confirmModal?.onCancel) {
      confirmModal.onCancel();
    }
    setConfirmModal(null);
  };

  const getVariantIcon = (variant: ModalVariant = "info") => {
    switch (variant) {
      case "danger":
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case "neutral":
        return <HelpCircle className="w-6 h-6 text-brand-navy-600" />;
      case "info":
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getVariantIconBg = (variant: ModalVariant = "info") => {
    switch (variant) {
      case "danger":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "success":
        return "bg-emerald-50 border-emerald-200";
      case "neutral":
        return "bg-brand-warm-100 border-brand-warm-300";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getConfirmButtonClasses = (variant: ModalVariant = "info") => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white shadow-sm";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-sm";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm";
      default:
        return "bg-brand-navy-950 hover:bg-brand-navy-900 text-white shadow-sm";
    }
  };

  return (
    <ModalContext.Provider value={{ confirm, alert, toast }}>
      {children}

      {/* CONFIRMATION POPUP MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-brand-warm-300 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getVariantIconBg(
                    confirmModal.variant
                  )}`}
                >
                  {getVariantIcon(confirmModal.variant)}
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                    {confirmModal.title || "Confirm Action"}
                  </h3>
                  <p className="text-sm text-brand-navy-700 leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-warm-200">
                <button
                  type="button"
                  disabled={isConfirming}
                  onClick={handleCancelAction}
                  className="px-4 py-2 text-xs font-semibold text-brand-navy-700 bg-brand-warm-100 hover:bg-brand-warm-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  {confirmModal.cancelText || "Cancel"}
                </button>
                <button
                  type="button"
                  disabled={isConfirming}
                  onClick={handleConfirmAction}
                  className={`px-5 py-2 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 ${getConfirmButtonClasses(
                    confirmModal.variant
                  )}`}
                >
                  {isConfirming && <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {confirmModal.confirmText || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALERT POPUP MODAL */}
      {alertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-brand-warm-300 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getVariantIconBg(
                    alertModal.variant
                  )}`}
                >
                  {getVariantIcon(alertModal.variant)}
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-bold font-serif text-brand-navy-950">
                    {alertModal.title || "Notice"}
                  </h3>
                  <p className="text-sm text-brand-navy-700 leading-relaxed whitespace-pre-line">
                    {alertModal.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-brand-warm-200">
                <button
                  type="button"
                  onClick={() => {
                    if (alertModal.onClose) alertModal.onClose();
                    setAlertModal(null);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-navy-950 hover:bg-brand-navy-900 rounded-xl transition-colors"
                >
                  {alertModal.buttonText || "Got it"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATIONS */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto bg-brand-navy-950 text-white px-4 py-3 rounded-xl border border-brand-navy-800 shadow-2xl flex items-center gap-3 animate-slide-up"
            >
              {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {t.type === "error" && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
              {t.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
              {(!t.type || t.type === "info") && <Info className="w-4 h-4 text-brand-gold-400 flex-shrink-0" />}
              <span className="text-xs font-medium text-brand-warm-100 flex-1">{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("usePopup must be used within a ModalProvider");
  }
  return context;
}
