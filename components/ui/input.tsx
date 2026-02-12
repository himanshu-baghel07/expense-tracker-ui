import { cn } from "@/lib/utils";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-transparent outline-none transition placeholder-gray-500",
        "[&:-webkit-autofill]:bg-gray-800 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_1000px_rgb(31,41,55)_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
