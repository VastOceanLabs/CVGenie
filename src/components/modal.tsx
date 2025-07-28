import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, LucideIcon } from 'lucide-react';

// Animation constants to keep JS and CSS in sync
const ANIMATION_DURATION = 200; // matches Tailwind's duration-200

// Generate unique ID for aria-describedby to prevent collisions
let modalIdCounter = 0;
const generateModalId = () => `modal-${++modalIdCounter}-${Date.now()}`;

// Modal variant types
type ModalVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface VariantConfig {
  icon: LucideIcon | null;
  headerBg: string;
  borderColor: string;
}

const typeConfig: Record<ModalVariant, VariantConfig> = {
  default: {
    icon: null,
    headerBg: 'bg-white',
    borderColor: 'border-gray-200'
  },
  success: {
    icon: CheckCircle,
    headerBg: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  warning: {
    icon: AlertTriangle,
    headerBg: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  error: {
    icon: AlertCircle,
    headerBg: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  info: {
    icon: Info,
    headerBg: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  type?: ModalVariant;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  preventBodyScroll?: boolean;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  containerClassName?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
  zIndex?: number;
  'aria-describedby'?: string;
}

// Utility to get scrollbar width and compensate for layout shift
const getScrollbarWidth = (): number => {
  if (typeof window === 'undefined') return 0;
  
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  (outer.style as any).msOverflowStyle = 'scrollbar';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  document.body.removeChild(outer);

  return scrollbarWidth;
};

// Create or get modal root element
const getModalRoot = (): HTMLElement | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }
  return modalRoot;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  preventBodyScroll = true,
  footer,
  className = '',
  overlayClassName = '',
  containerClassName = '',
  animation = 'scale',
  zIndex = 1000,
  'aria-describedby': ariaDescribedBy
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const originalBodyStyle = useRef<string>('');
  const originalBodyPadding = useRef<string>('');
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [modalDescriptionId] = useState(() => 
    ariaDescribedBy || generateModalId()
  );

  // Memoize onClose to prevent unnecessary effect re-runs
  const memoizedOnClose = useCallback(() => onClose(), [onClose]);

  // Handle modal mounting/unmounting with animation
  useEffect(() => {
    // Clear any existing timer
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
    }

    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Delay to allow for mounting before animation
      animationTimer.current = setTimeout(() => setIsAnimating(false), 10);
    } else if (shouldRender) {
      setIsAnimating(true);
      // Delay unmounting to allow exit animation
      animationTimer.current = setTimeout(() => {
        setShouldRender(false);
        setIsAnimating(false);
        // Restore focus to previous element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, ANIMATION_DURATION);
    }

    // Cleanup function
    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
        animationTimer.current = null;
      }
    };
  }, [isOpen, shouldRender]);

  // Handle body scroll prevention with scrollbar compensation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen && preventBodyScroll) {
      const scrollbarWidth = getScrollbarWidth();
      
      // Store original styles
      originalBodyStyle.current = document.body.style.overflow;
      originalBodyPadding.current = document.body.style.paddingRight;
      
      // Apply scroll lock with scrollbar compensation
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    
    // Always return cleanup function to prevent style locks
    return () => {
      document.body.style.overflow = originalBodyStyle.current;
      document.body.style.paddingRight = originalBodyPadding.current;
    };
  }, [isOpen, preventBodyScroll]);

  // Handle escape key with memoized handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && isOpen) {
        memoizedOnClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, memoizedOnClose]);

  // Focus management with dynamic focusable elements
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Function to get current focusable elements
      const getFocusableElements = () =>
        modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        ) ?? [];

      const focusableElements = getFocusableElements();
      
      // Focus first focusable element or modal itself as fallback
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        // Fallback: focus the modal container itself
        modalRef.current.setAttribute('tabindex', '-1');
        modalRef.current.focus();
      }

      // Handle tab trapping with fresh element detection on each keypress
      const handleTab = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          // Re-compute focusable elements to handle dynamic content
          const currentFocusableElements = getFocusableElements();
          
          if (currentFocusableElements.length === 0) return;

          const firstElement = currentFocusableElements[0];
          const lastElement = currentFocusableElements[currentFocusableElements.length - 1];

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen, shouldRender]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnBackdrop) {
      memoizedOnClose();
    }
  }, [closeOnBackdrop, memoizedOnClose]);

  // Size classes with proper responsive handling
  const sizeClasses = {
    sm: 'max-w-md mx-4',
    md: 'max-w-lg mx-4',
    lg: 'max-w-2xl mx-4 sm:mx-6',
    xl: 'max-w-4xl mx-4 sm:mx-6',
    full: 'max-w-none mx-0 h-full sm:h-auto sm:max-h-[90vh] sm:mx-4 sm:rounded-lg'
  };

  // Animation classes
  const getAnimationClasses = () => {
    const baseTransition = `transition-all duration-200 ease-out`;
    
    switch (animation) {
      case 'fade':
        return {
          overlay: `${baseTransition} ${isAnimating ? 'opacity-0' : 'opacity-100'}`,
          modal: `${baseTransition} ${isAnimating ? 'opacity-0' : 'opacity-100'}`
        };
      case 'slide-up':
        return {
          overlay: `${baseTransition} ${isAnimating ? 'opacity-0' : 'opacity-100'}`,
          modal: `${baseTransition} ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`
        };
      case 'slide-down':
        return {
          overlay: `${baseTransition} ${isAnimating ? 'opacity-0' : 'opacity-100'}`,
          modal: `${baseTransition} ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`
        };
      case 'scale':
        return {
          overlay: `${baseTransition} ${isAnimating ? 'opacity-0' : 'opacity-100'}`,
          modal: `${baseTransition} ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`
        };
      case 'none':
      default:
        return {
          overlay: '',
          modal: ''
        };
    }
  };

  const animationClasses = getAnimationClasses();
  const currentTypeConfig = typeConfig[type];
  const IconComponent = currentTypeConfig.icon;

  if (!shouldRender || typeof window === 'undefined') return null;

  const modalContent = (
    <div 
      className={`fixed inset-0 flex items-center justify-center ${size === 'full' ? 'p-0' : 'p-4'} ${overlayClassName}`}
      style={{ zIndex }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm ${animationClasses.overlay}`}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className={`relative w-full ${sizeClasses[size]} ${containerClassName}`}>
        <div 
          ref={modalRef}
          className={`
            relative bg-white shadow-xl border ${currentTypeConfig.borderColor}
            ${size === 'full' ? 'h-full rounded-none' : 'max-h-[90vh] rounded-lg'} 
            flex flex-col
            ${animationClasses.modal}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={modalDescriptionId}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={`
              flex items-center justify-between px-6 py-4 border-b border-gray-200 
              ${currentTypeConfig.headerBg} ${size === 'full' ? 'rounded-none' : 'rounded-t-lg'}
            `}>
              <div className="flex items-center space-x-3">
                {IconComponent && (
                  <IconComponent className={`w-5 h-5 ${
                    type === 'success' ? 'text-green-600' :
                    type === 'warning' ? 'text-yellow-600' :
                    type === 'error' ? 'text-red-600' :
                    type === 'info' ? 'text-blue-600' :
                    'text-gray-600'
                  }`} />
                )}
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    {title}
                  </h2>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={memoizedOnClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4" id={modalDescriptionId}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${size === 'full' ? 'rounded-none' : 'rounded-b-lg'}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal in portal to dedicated modal root
  const modalRoot = getModalRoot();
  if (!modalRoot) return null;
  
  return createPortal(modalContent, modalRoot);
};

// Convenience wrapper components for common modal types
export const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info' | 'success';
  isLoading?: boolean;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  }, [onConfirm, onClose, isLoading]);

  const [confirmModalId] = useState(() => `confirm-modal-${generateModalId()}`);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="sm"
      aria-describedby={confirmModalId}
      footer={
        <div className="flex space-x-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] ${
              type === 'error' 
                ? 'bg-red-600 hover:bg-red-700' 
                : type === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      }
    >
      <p id={confirmModalId} className="text-gray-600 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
};

// Improved hook for managing modal state with memoized functions
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

export default Modal;