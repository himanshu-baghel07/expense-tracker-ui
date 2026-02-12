import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { ISignupFormUI } from "./types";

export function SignupFormUI({
  form,
  onSubmit,
  handleFormChange,
  showPassword,
  showConfirmPassword,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  error,
  isLoading,
}: ISignupFormUI) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
        <p className="text-gray-400 text-sm">
          Get started with your free account
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Enter your name"
            required
            minLength={2}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <Input
            name="email"
            value={form.email}
            onChange={handleFormChange}
            placeholder="you@example.com"
            type="email"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Input
              name="password"
              value={form.password}
              onChange={handleFormChange}
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              className="pr-12"
              required
              minLength={6}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 active:scale-95"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleFormChange}
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              className="pr-12"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 active:scale-95"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
