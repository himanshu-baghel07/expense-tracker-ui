import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { ILoginFormUI } from "./types";

export function LoginFormUI({
  form,
  onSubmit,
  handleFormChange,
  error,
  isLoading,
}: ILoginFormUI) {
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("password")?.focus();
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Let the form's natural submit handle this instead of programmatic click
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-400 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            value={form.email}
            onChange={handleFormChange}
            onKeyDown={handleEmailKeyDown}
            placeholder="you@example.com"
            type="email"
            autoFocus
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Password
          </label>
          <Input
            id="password"
            name="password"
            value={form.password}
            onChange={handleFormChange}
            onKeyDown={handlePasswordKeyDown}
            placeholder="Enter your password"
            type="password"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        id="submit-button"
        type="submit"
        disabled={form.email === "" || form.password === "" || isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
