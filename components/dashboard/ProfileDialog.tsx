"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { updateProfile } from "@/lib/actions/auth.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency?: string;
  monthlyBudget?: number;
}

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onProfileUpdate: () => void;
}

export default function ProfileDialog({
  isOpen,
  onClose,
  user,
  onProfileUpdate,
}: ProfileDialogProps) {
  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency || "USD");
  const [monthlyBudget, setMonthlyBudget] = useState(
    user.monthlyBudget?.toString() || "",
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user.name);
    setCurrency(user.currency || "USD");
    setMonthlyBudget(user.monthlyBudget?.toString() || "");
    setAvatarPreview(user.avatar || "");
  }, [user.id, user.name, user.currency, user.monthlyBudget, user.avatar]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPEG, PNG, GIF, or WebP");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("currency", currency);
      if (monthlyBudget) {
        formData.append("monthlyBudget", monthlyBudget);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully!");
        onProfileUpdate();
        onClose();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isMobile = useIsMobile();
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 ring-2 ring-blue-600/50 shrink-0">
          <AvatarImage src={avatarPreview} alt={name} />
          <AvatarFallback className="bg-linear-to-br from-blue-600 to-purple-600 text-white text-2xl font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={() => fileInputRef.current?.click()}
          className="border-gray-800 hover:bg-gray-800"
        >
          <Upload className="h-4 w-4 shrink-0" />
          Upload Avatar
        </Button>
        <p className="text-xs text-gray-500 text-center pb-1">
          Max 5MB (JPEG, PNG, GIF, WebP)
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user.email}
          disabled
          className="opacity-50 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500">Email cannot be changed</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Input
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="USD"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyBudget">Monthly Budget</Label>
        <Input
          id="monthlyBudget"
          type="number"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(e.target.value)}
          placeholder="5000"
          min="0"
          step="0.01"
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="border-gray-800 hover:bg-gray-800 order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="order-1 sm:order-2"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          className="sm:max-w-[500px] sm:mx-auto sm:rounded-t-2xl"
        >
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>
              Update your profile information and avatar
            </SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and avatar
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
