"use client";

import { Button } from "@/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-black/50 border border-gray-800 rounded-lg p-8 text-center backdrop-blur-sm">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-red-600/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Something went wrong!
          </h2>
          <p className="text-gray-400 mb-6">
            An error occurred while loading this page. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => reset()}>Try Again</Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="border-gray-800 hover:bg-gray-800"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
