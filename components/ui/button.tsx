import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "w-full focus:outline-1 cursor-pointer disabled:cursor-not-allowed font-semibold py-3 rounded-tl-xl rounded-br-xl transition shadow-lg disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#FF0087] to-[#9400FF] text-white hover:from-[#FF0087]/80 hover:to-[#9400FF]/80 hover:shadow-[#27005D]/50",
        outline:
          "border-2 border-[#FF0087] text-[#FF0087] bg-transparent hover:bg-[#FF0087]/10 hover:shadow-[#FF0087]/30",
        save: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg shadow-purple-500/20 transition-all duration-200",
        cancel:
          "bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 hover:border-slate-600 text-white transition-all duration-200 border",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp className={cn(buttonVariants({ variant, className }))} {...props} />
  );
}

export { Button, buttonVariants };
