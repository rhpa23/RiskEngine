'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Cancelar',
  type = 'info'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  type === 'danger' && "bg-error-container text-error",
                  type === 'warning' && "bg-secondary-container text-secondary",
                  type === 'info' && "bg-primary-container text-primary",
                  type === 'success' && "bg-emerald-100 text-emerald-600"
                )}>
                  {type === 'danger' && <AlertTriangle className="w-6 h-6" />}
                  {type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                  {type === 'info' && <Info className="w-6 h-6" />}
                  {type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-headline font-bold text-on-surface">{title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-surface-container-high rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-on-surface-variant/40" />
                </button>
              </div>
            </div>
            <div className="bg-surface-container-low px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  "px-6 py-2 text-sm font-bold text-white rounded-lg shadow-lg transition-all active:scale-95",
                  type === 'danger' && "bg-error shadow-error/20 hover:bg-error-dim",
                  type === 'warning' && "bg-secondary shadow-secondary/20 hover:bg-secondary-dim",
                  type === 'info' && "bg-primary shadow-primary/20 hover:bg-primary-dim",
                  type === 'success' && "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                )}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
