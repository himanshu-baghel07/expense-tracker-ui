"use client";

import { loginAction } from "@/app/action/auth";
import { useAuth } from "@/context/AuthContext.client";
import React, { useState } from "react";
import { LoginFormUI } from "./LoginFormUI";
import { FormState } from "./types";

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAction(formData);

      // If we get here, login failed (redirect would have thrown)
      if (result && !result.success) {
        setError(result.message);
        setIsLoading(false);
      }
    } catch (err) {
      // Redirect throws an error, so we need to check if it's a redirect
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        // This is expected - redirect is happening
        throw err;
      }
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  return (
    <LoginFormUI
      form={form}
      onSubmit={handleSubmit}
      handleFormChange={handleFormChange}
      error={error}
      isLoading={isLoading}
    />
  );
}
