import { useEffect, useRef } from "react";

/**
 * While `isOpen` is true, pushes a marker onto the history stack so the
 * mobile back gesture (or browser back button) closes the overlay instead
 * of navigating away. Cleans up automatically when the overlay closes.
 */
export const useOverlayHistory = (isOpen: boolean, onClose: () => void) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    // Preserve React Router's state (idx/key/usr) and add our marker
    const prev = window.history.state;
    window.history.pushState({ ...prev, __overlay: true }, "");

    const onPop = () => {
      onCloseRef.current();
    };

    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      // If the user closed via ✕ / ESC (not via back), remove our marker entry
      if (window.history.state?.__overlay) {
        window.history.back();
      }
    };
  }, [isOpen]);
};