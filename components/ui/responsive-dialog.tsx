"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as React from "react";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

/**
 * A responsive dialog component that shows a dialog on desktop
 * and a bottom sheet on mobile devices.
 *
 * Usage:
 * ```tsx
 * <ResponsiveDialog open={open} onOpenChange={setOpen} title="My Dialog">
 *   <div className="p-6">
 *     Your content here
 *   </div>
 * </ResponsiveDialog>
 * ```
 */
export function ResponsiveDialog({
  open,
  onOpenChange,
  children,
  title,
  className,
}: ResponsiveDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        showCloseButton={true}
        showHandle={true}
        className={className}
      >
        {children}
      </BottomSheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
      </DialogContent>
    </Dialog>
  );
}
