import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-normal hover:opacity-80 cursor-pointer disabled:cursor-not-allowed outline-none select-none transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring py-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#0a8df2] text-white font-semibold shadow-lg hover:shadow-xl active:scale-[0.98]",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground",
      },
      size: {
        default: "min-h-10 px-6",
        sm: "min-h-9 px-4 text-xs",
        lg: "min-h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size }),
        loading && "px-0 w-12 overflow-hidden",
        "transition-all duration-300",
      )}
      disabled={loading}
      {...props}
    >
      {/* Content: icon + text with consistent gap from button gap-2 */}
      <span
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-opacity duration-200",
          loading && "opacity-0",
        )}
      >
        {children}
      </span>

      {/* Spinner - only clip when loading */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </span>
      )}
    </Comp>
  );
}

export { Button };
