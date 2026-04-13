"use client";

import { registerUser } from "@/lib/actions/auth.action";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SignupFormClientProps {
  setViewMode: (viewMode: string) => void;
}

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Please enter the email address")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupFormClient = ({ setViewMode }: SignupFormClientProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, ...payload } = data;
      const result = await registerUser(payload);

      if (result.success) {
        toast.success("Account created successfully!");
        reset();
        setViewMode("login");
      } else {
        toast.error(result.error || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="John Doe"
            {...register("name")}
            disabled={isSubmitting}
            className={errors.name ? "border-red-400" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="john@mail.com"
            {...register("email")}
            disabled={isSubmitting}
            className={errors.email ? "border-red-400" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Test@123"
              {...register("password")}
              disabled={isSubmitting}
              className={`pr-10 ${errors.password ? "border-red-400" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Test@123"
              {...register("confirmPassword")}
              disabled={isSubmitting}
              className={`pr-10 ${errors.confirmPassword ? "border-red-400" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Sign Up
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-100">
        Already have an account?{" "}
        <span
          onClick={() => setViewMode("login")}
          className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer hover:underline transition-colors"
        >
          Login
        </span>
      </div>
    </form>
  );
};

export default SignupFormClient;
