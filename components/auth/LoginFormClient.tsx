"use client";

import { getProfile, loginUser } from "@/lib/actions/auth.action";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { LoginFormData, loginSchema } from "@/utils/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginFormClientProps {
  setViewMode: (viewMode: string) => void;
}

const LoginFormClient = ({ setViewMode }: LoginFormClientProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginUser(data);

      if (result.success) {
        toast.success("Login successful!");
        await getProfile();
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="john@mail.com"
            {...register("email")}
            disabled={isSubmitting}
            className={`${errors.email ? "border-red-400" : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Test@123"
            {...register("password")}
            disabled={isSubmitting}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          Login
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        Are you new?{" "}
        <span
          onClick={() => setViewMode("signup")}
          className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer hover:underline transition-colors"
        >
          Create Account
        </span>
      </div>
    </form>
  );
};

export default LoginFormClient;
