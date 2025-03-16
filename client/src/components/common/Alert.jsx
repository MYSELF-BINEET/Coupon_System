// import React, { useState, useEffect } from 'react';
// // import ReactDOM from 'react-dom/client';
// import ReactDOM from 'react-dom'; // ✅ Correct for React 17-

// const Alert = ({ 
//   type = 'info', 
//   message, 
//   onClose,
//   isToast = false,
//   duration = 3000,
//   position = 'bottom-right'
// }) => {
//   const [visible, setVisible] = useState(true);
  
//   const bgColors = {
//     success: 'bg-green-100 border-green-400 text-green-700',
//     error: 'bg-red-100 border-red-400 text-red-700',
//     warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
//     info: 'bg-blue-100 border-blue-400 text-blue-700',
//   };
  
//   const positions = {
//     'top-right': 'fixed top-4 right-4',
//     'top-left': 'fixed top-4 left-4',
//     'bottom-right': 'fixed bottom-4 right-4',
//     'bottom-left': 'fixed bottom-4 left-4',
//     'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2',
//     'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2'
//   };
  
//   useEffect(() => {
//     if (isToast) {
//       const timer = setTimeout(() => {
//         setVisible(false);
//         if (onClose) onClose();
//       }, duration);
      
//       return () => clearTimeout(timer);
//     }
//   }, [duration, onClose, isToast]);
  
//   if (!visible) return null;
  
//   const baseClasses = `border-l-4 p-4 ${bgColors[type]}`;
//   const toastClasses = isToast ? 
//     `${positions[position]} shadow-lg rounded max-w-xs z-50 transform transition-transform duration-300 ease-in-out` : 
//     'mb-4';
  
//   return (
//     <div className={`${baseClasses} ${toastClasses}`} role="alert">
//       <p className="font-medium">{message}</p>
//       {(onClose || isToast) && (
//         <button
//           className={isToast ? "absolute top-1 right-1" : "absolute top-0 right-0 mt-2 mr-2"}
//           onClick={() => {
//             setVisible(false);
//             if (onClose) onClose();
//           }}
//           aria-label="Close alert"
//         >
//           <span className={isToast ? "text-xl" : "text-2xl"}>&times;</span>
//         </button>
//       )}
//     </div>
//   );
// };

// // Helper function to create toast container if it doesn't exist
// const getOrCreateToastContainer = () => {
//   if (typeof window === 'undefined' || typeof document === 'undefined') {
//     return null;
//   }

//   let container = document.getElementById('toast-container');
  
//   if (!container) {
//     container = document.createElement('div');
//     container.id = 'toast-container';
//     container.className = 'fixed inset-0 z-50 flex flex-col-reverse items-end p-4 space-y-2 pointer-events-none';
//     document.body.appendChild(container);
//   }
  
//   return container;
// };

// // Static method for showing toasts
// Alert.toast = (message, type = 'info', options = {}) => {
//   if (typeof window === 'undefined' || typeof document === 'undefined') {
//     console.warn('Alert.toast called in non-browser environment');
//     return null;
//   }

//   const toastContainer = getOrCreateToastContainer();
//   if (!toastContainer) return;

//   const toastElement = document.createElement('div');
//   toastContainer.appendChild(toastElement);

//   const root = ReactDOM.createRoot(toastElement);
  
//   root.render(
//     <Alert 
//       message={message}
//       type={type}
//       isToast={true}
//       duration={options.duration || 3000}
//       position={options.position || 'bottom-right'}
//       onClose={() => {
//         setTimeout(() => {
//           root.unmount();
//           if (toastElement.parentNode) {
//             toastElement.parentNode.removeChild(toastElement);
//           }
//         }, 300);
//         if (options.onClose) options.onClose();
//       }}
//     />
//   );

//   return toastElement;
// };

// export default Alert;


import React, { useState } from 'react';

const Alert = ({
  type = 'info',
  message,
  onClose
}) => {
  const [visible, setVisible] = useState(true);
  
  // Simple color styles
  const styles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  if (!visible) return null;

  return (
    <div className={`border-l-4 p-4 mb-4 ${styles[type]}`} role="alert">
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Alert;



// {onClose && (
//   <button
//     className="absolute top-0 right-0 mt-2 mr-2"
//     onClick={() => {
//       setVisible(false);
//       onClose();
//     }}
//     aria-label="Close alert"
//   >
//     <span className="text-2xl">&times;</span>
//   </button>
// )}