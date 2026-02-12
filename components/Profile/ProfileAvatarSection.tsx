import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileAvatarSectionProps } from "./types";

export function ProfileAvatarSection({
  isEditMode,
  previewAvatar,
  name,
  email,
  onAvatarClick,
  fileInputRef,
  onFileChange,
  onEdit,
}: ProfileAvatarSectionProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when avatar changes
  useEffect(() => {
    setImgError(false);
  }, [previewAvatar]);

  const getInitials = (n: string) =>
    n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  console.log("🖼️ Avatar Debug:", {
    previewAvatar,
    hasAvatar: !!previewAvatar,
    imgError,
  });

  return (
    <div className="grid grid-cols-12 items-center pl-2">
      <div className="relative group shrink-0 col-span-4">
        {previewAvatar && !imgError ? (
          <div className="relative">
            <img
              src={previewAvatar}
              alt={name}
              className={`h-20 w-20 rounded-full object-cover ring-4 ring-purple-500/20 shadow-lg shadow-purple-500/10 transition-all duration-300 ${
                isEditMode
                  ? "cursor-pointer group-hover:ring-purple-500/40"
                  : ""
              }`}
              onClick={onAvatarClick}
              onError={(e) => {
                console.error("❌ Image failed to load:", previewAvatar);
                setImgError(true);
              }}
            />
          </div>
        ) : (
          <Avatar
            className={`h-20 w-20 ring-4 ring-purple-500/20 shadow-lg shadow-purple-500/10 transition-all duration-300 ${
              isEditMode ? "cursor-pointer group-hover:ring-purple-500/40" : ""
            }`}
            onClick={onAvatarClick}
          >
            <AvatarFallback className="text-3xl font-bold bg-linear-to-br from-purple-600 via-purple-500 to-pink-500 text-white">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        )}

        {isEditMode && (
          <button
            onClick={onAvatarClick}
            className="absolute bottom-0 right-0 p-2.5 bg-linear-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
            title="Upload Avatar"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      <div className="col-span-6 min-w-0 text-left">
        <h3 className="text-xl font-semibold text-white truncate">{name}</h3>
        <p className="text-sm text-gray-400 mt-0.5 truncate">{email}</p>
      </div>

      <div className="col-span-2 flex justify-end">
        {!isEditMode && (
          <Button
            onClick={onEdit}
            variant="outline"
            className="p-2 w-auto hover:bg-slate-800/60 border-0 shadow-none"
            title="Edit Profile"
          >
            <Pencil className="h-4 w-4 text-gray-400 hover:text-purple-400" />
          </Button>
        )}
      </div>
    </div>
  );
}
