"use client";

import { signupAction } from "@/app/action/auth";
import React, { useState } from "react";
import { SignupFormUI } from "./SignupFormUI";
import { SignupFormState } from "./types";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [form, setForm] = useState<SignupFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (form.name.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);

      const result = await signupAction(formData);

      if (!result.success) {
        setError(result.message);
        setIsLoading(false);
        return;
      }

      // Success - switch to login
      if (onSwitchToLogin) {
        onSwitchToLogin();
      }

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }

  return (
    <SignupFormUI
      form={form}
      onSubmit={handleSubmit}
      handleFormChange={handleFormChange}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      togglePasswordVisibility={() => setShowPassword(!showPassword)}
      toggleConfirmPasswordVisibility={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      error={error}
      isLoading={isLoading}
    />
  );
}
