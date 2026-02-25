"use client";

import { registerUser } from "@/lib/actions/auth.action";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SignupFormClientProps {
  setViewMode: (viewMode: string) => void;
}

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Please enter the email address").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupFormClient = ({ setViewMode }: SignupFormClientProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await registerUser(data);

      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
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
          <Input
            type="password"
            id="password"
            placeholder="Test@123"
            {...register("password")}
            disabled={isSubmitting}
            className={errors.password ? "border-red-400" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          Sign Up
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
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
