"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Drive a native `<dialog>` from React.
 *
 * Native `<dialog>` + `showModal()` is what the design system's CSS targets,
 * and it hands us three things a hand-rolled overlay has to reimplement and
 * usually gets subtly wrong: Escape closes it, focus is contained while it is
 * open, and focus returns to the element that opened it on close. The
 * `::backdrop` pseudo-element and the inertness of the page behind come free.
 *
 * React has no declarative API for it, hence this ref-driven hook.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // A modal dialog makes the rest of the document inert, but the page
      // behind can still SCROLL on some browsers — which slides the content out
      // from under the sheet and loses the reader's place.
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }

    if (!open) document.body.style.overflow = "";
  }, [open]);

  // Escape and programmatic close both fire `close`, so React state is synced
  // from the element rather than from each individual trigger.
  const handleClose = useCallback(() => {
    document.body.style.overflow = "";
    onClose();
  }, [onClose]);

  /** Clicking the backdrop closes it: that click lands on the dialog itself. */
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === ref.current) onClose();
    },
    [onClose]
  );

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    []
  );

  return { ref, handleClose, handleClick };
}
