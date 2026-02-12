import { ArrowLeft } from "lucide-react";

type Props = {
  isEditMode: boolean;
  onClose: () => void;
};

export function ProfileHeader({ isEditMode, onClose }: Props) {
  return (
    <div className="hidden xl:flex items-center justify-start px-2 py-2  bg-slate-800/50 backdrop-blur-sm">
      <button onClick={onClose} className="p-2 cursor-pointer">
        <ArrowLeft className="h-5 w-5 text-gray-100 hover:text-gray-400" />
      </button>
      <h2 className="text-xl font-semibold text-white tracking-tight">
        Profile
      </h2>
    </div>
  );
}
