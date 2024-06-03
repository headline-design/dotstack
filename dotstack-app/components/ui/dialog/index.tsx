"use client";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/dotstack-app/lib/utils";
import { Drawer } from "vaul";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import useMediaQuery from "@/dotstack-app/lib/hooks/use-media-query";
import styles from "./styles.module.css";

export default function Dialog({
  unstyledModal = false,
  children,
  showModal,
  setShowModal,
  className,
  onClose,
  preventDefaultClose,
  backdropClass,
  handle = false,
  dialogWidth = "450px",
}: {
  unstyledModal?: boolean;
  children: React.ReactNode;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  onClose?: () => void;
  preventDefaultClose?: boolean;
  backdropClass?: string;
  handle?: boolean;
  dialogWidth?: string;
}) {
  const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose && onClose();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
      // else, this is intercepting route @modal
    } else {
      router.back();
    }
  };
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
      >
        <Drawer.Overlay className="fixed inset-0 z-50 bg-backdrop-1" />
        <Drawer.Portal>
          <Drawer.Content
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className={cn(
              "rust-modal",
              "fixed bottom-0 left-0 right-0 z-50 mt-24 w-full overflow-hidden rounded-t-[10px] border-t bg-background",
              className,
            )}
          >
            {handle && (
              <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
                <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
              </div>
            )}

            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <DialogPrimitive.Root
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => closeModal(), 300);
          closeModal();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <div className={styles.dialogBackdrop} />
        <DialogPrimitive.Overlay
          id="modal-backdrop"
          className={cn(styles.dialogOverlay, backdropClass)}
        >
          <div tabIndex={-1}>
            <DialogPrimitive.Content
              style={{ width: dialogWidth }}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className={cn(
                unstyledModal ? "" : styles.dialogWrapper,
                className,
                dialogWidth ? "" : "max-w-md",
              )}
            >
              {children}
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
