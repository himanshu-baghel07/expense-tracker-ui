import { Input } from "@/components/ui/input";
import { ProfileInfoFormProps } from "./types";

export function ProfileInfoForm({
  isEditMode,
  formData,
  onChange,
  nameInputRef,
  phoneError,
}: ProfileInfoFormProps) {
  const inputClass = `bg-slate-800/50 border-slate-700/50 text-white placeholder:text-gray-500 
    focus:border-purple-500/50 focus:ring-purple-500/20 transition-all ${
      !isEditMode ? "cursor-default opacity-70" : "hover:border-slate-600"
    }`;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Full Name
        </label>
        <Input
          ref={nameInputRef}
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          readOnly={!isEditMode}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Email Address
        </label>
        <Input
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          readOnly={!isEditMode}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Phone Number
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            +91
          </span>
          <Input
            value={formData.phone.replace("+91", "")}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              onChange("phone", value ? `+91${value}` : "");
            }}
            readOnly={!isEditMode}
            placeholder="9876543210"
            maxLength={10}
            className={`${inputClass} pl-12 ${phoneError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
            type="tel"
          />
        </div>
        {phoneError && (
          <p className="text-xs text-red-400 mt-1">{phoneError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Preferred Currency
        </label>
        <Input
          value={formData.currency}
          onChange={(e) => onChange("currency", e.target.value)}
          readOnly={!isEditMode}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Monthly Budget
        </label>
        <Input
          value={formData.monthlyBudget || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            onChange("monthlyBudget", value);
          }}
          readOnly={!isEditMode}
          placeholder="5000"
          className={inputClass}
          type="text"
        />
      </div>
    </div>
  );
}
