"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  useEffect(() => {
    const handleToastClick = (e: MouseEvent) => {
      const toastElement = (e.target as HTMLElement).closest(
        "[data-sonner-toast]",
      );
      if (toastElement) {
        const toastId = toastElement.getAttribute("data-toast-id");
        if (toastId) {
          toast.dismiss(toastId);
        }
      }
    };

    document.addEventListener("click", handleToastClick);
    return () => document.removeEventListener("click", handleToastClick);
  }, []);

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton={false}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:shadow-lg cursor-pointer",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "!bg-[#0a3d2c] !text-[#2fd181] !border-[#2fd181]",
          error: "!bg-[#3d0a0a] !text-[#ff7a72] !border-[#ff7a72]",
          warning: "!text-yellow-600 !border-yellow-600",
          info: "!text-blue-600 !border-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
