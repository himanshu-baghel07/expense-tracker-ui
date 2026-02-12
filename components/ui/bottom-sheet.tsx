"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  showHandle?: boolean;
  className?: string;
}

function BottomSheet({
  open,
  onOpenChange,
  children,
  title,
  showCloseButton = true,
  showHandle = true,
  className,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex flex-col",
              "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
              "border-t border-slate-700/30 shadow-2xl",
              "rounded-t-2xl",
              "max-h-[95vh]",
              className,
            )}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {showHandle && (
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
              </div>
            )}

            {title && (
              <h3 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-medium text-white">
                {title}
              </h3>
            )}

            {showCloseButton && (
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <XIcon className="h-5 w-5 text-white" />
                <span className="sr-only">Close</span>
              </button>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BottomSheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)} {...props}>
      {children}
    </div>
  );
}

function BottomSheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col space-y-2 px-6 pt-2 pb-4", className)}
      {...props}
    />
  );
}

function BottomSheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 p-6 mt-auto border-t border-slate-700/30",
        "sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}

function BottomSheetTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function BottomSheetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
};
