"use client";

import LoginForm from "@/components/auth/LoginForm.client";
import SignupForm from "@/components/auth/SignupForm.client";
import { useState } from "react";

export default function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 p-10">
      {mode === "login" ? (
        <>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {"  Don't have an account?"}&nbsp;
              <button
                onClick={() => setMode("signup")}
                className="font-semibold text-[#00F5FF] cursor-pointer hover:text-[#00F5FF]/60 transition"
              >
                Sign up
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <SignupForm onSwitchToLogin={() => setMode("login")} />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-semibold text-[#00F5FF] cursor-pointer hover:text-[#00F5FF]/60 transition"
              >
                Sign in
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
