import React, { useEffect } from 'react';

export default function CustomModal({
  isOpen,
  title,
  message,
  type = 'info', // 'warning' | 'success' | 'error' | 'info' | 'confirm'
  confirmText,
  cancelText = 'إلغاء',
  onConfirm,
  onClose,
  isConfirm = false
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        if (onConfirm) {
          onConfirm();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  // Icon configuration based on type
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <i className="fa-solid fa-circle-check"></i>,
          badgeClass: 'badge-success',
          defaultTitle: 'تم بنجاح'
        };
      case 'error':
        return {
          icon: <i className="fa-solid fa-circle-xmark"></i>,
          badgeClass: 'badge-error',
          defaultTitle: 'حدث خطأ'
        };
      case 'warning':
        return {
          icon: <i className="fa-solid fa-triangle-exclamation"></i>,
          badgeClass: 'badge-warning',
          defaultTitle: 'تنبيه'
        };
      case 'confirm':
        return {
          icon: <i className="fa-solid fa-trash-can"></i>,
          badgeClass: 'badge-confirm',
          defaultTitle: 'تأكيد الإجراء'
        };
      case 'info':
      default:
        return {
          icon: <i className="fa-solid fa-circle-info"></i>,
          badgeClass: 'badge-info',
          defaultTitle: 'إشعار'
        };
    }
  };

  const { icon, badgeClass, defaultTitle } = getIconConfig();
  const displayTitle = title || defaultTitle;
  const displayConfirmText = confirmText || (isConfirm ? 'تأكيد' : 'حسناً، فهمت');

  const handleConfirmClick = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div 
      className="custom-popup-overlay" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="custom-popup-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X Button */}
        <button 
          type="button" 
          className="custom-popup-close-btn" 
          onClick={onClose} 
          aria-label="إغلاق"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Top Type Icon */}
        <div className={`custom-popup-icon-wrap ${badgeClass}`}>
          {icon}
        </div>

        {/* Content */}
        <div className="custom-popup-body">
          <h3 className="custom-popup-title">{displayTitle}</h3>
          <p className="custom-popup-message">{message}</p>
        </div>

        {/* Actions Footer */}
        <div className="custom-popup-actions">
          {isConfirm && (
            <button 
              type="button" 
              className="custom-popup-btn cancel-btn" 
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}

          <button 
            type="button" 
            className={`custom-popup-btn primary-btn ${isConfirm ? 'danger-style' : ''}`} 
            onClick={handleConfirmClick}
            autoFocus
          >
            {displayConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
