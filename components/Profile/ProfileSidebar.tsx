"use client";

import { getProfile, updateUserProfile } from "@/app/action/auth";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext.client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useRef, useState } from "react";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatarSection } from "./ProfileAvatarSection";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { ProfileSidebarProps } from "./types";

export function ProfileSidebar({ open, onClose, user }: ProfileSidebarProps) {
  const { login } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    currency: user.currency || "USD",
    avatar: user.avatar || "",
    monthlyBudget: 0,
  });
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar || "");
  const [phoneError, setPhoneError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch profile data when sidebar opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (!open) return;

      setIsLoading(true);
      console.log("🔄 Fetching profile data...");

      const result = await getProfile();

      if (result.success && result.data) {
        console.log("✅ Profile data fetched:", result.data);
        console.log("🔑 Profile data keys:", Object.keys(result.data));
        const profileData = result.data;

        setFormData({
          name: profileData.name || user.name,
          email: profileData.email || user.email,
          phone: profileData.phone || profileData.profile?.phone || "",
          currency:
            profileData.currency || profileData.profile?.currency || "USD",
          avatar:
            profileData.avatar ||
            profileData.profile?.avatar ||
            profileData.avatarUrl ||
            profileData.profilePicture ||
            profileData.image ||
            "",
          monthlyBudget:
            profileData.monthlyBudget ||
            profileData.profile?.monthlyBudget ||
            0,
        });
        setPreviewAvatar(
          profileData.avatar ||
            profileData.profile?.avatar ||
            profileData.avatarUrl ||
            profileData.profilePicture ||
            profileData.image ||
            "",
        );

        // Update auth context with fresh data
        login({
          name: profileData.name || user.name,
          email: profileData.email || user.email,
          phone: profileData.phone || profileData.profile?.phone,
          currency: profileData.currency || profileData.profile?.currency,
          isEmailVerified: profileData.isEmailVerified || user.isEmailVerified,
          avatar:
            profileData.avatar ||
            profileData.profile?.avatar ||
            profileData.avatarUrl ||
            "",
        });
      } else {
        console.error("❌ Failed to fetch profile:", result.message);
        // Fallback to user prop data
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          currency: user.currency || "USD",
          avatar: user.avatar || "",
          monthlyBudget: 0,
        });
        setPreviewAvatar(user.avatar || "");
      }

      setIsLoading(false);
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleEdit = () => {
    setIsEditMode(true);
    // Focus name input after state update
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setPhoneError("");
    setSaveError("");
    setSaveSuccess(false);
    // Don't reset to user prop, keep the fetched API data
    // This prevents losing the fresh data from getProfile
  };

  const handleSave = async () => {
    // Validate phone number
    if (formData.phone && formData.phone !== "+91") {
      const phoneDigits = formData.phone.replace("+91", "");
      if (phoneDigits.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
        return;
      }
    }

    setPhoneError("");
    setSaveError("");
    setSaveSuccess(false);
    setIsSaving(true);

    // Prepare data for API - send all fields
    const updateData: {
      name?: string;
      email?: string;
      phone?: string;
      currency?: string;
      monthlyBudget?: number;
    } = {};

    // Always send the current values
    updateData.name = formData.name;
    updateData.email = formData.email;
    updateData.phone = formData.phone || undefined;
    updateData.currency = formData.currency;
    if (formData.avatar) {
      // @ts-ignore - Dynamic property assignment
      updateData.avatar = formData.avatar;
    }
    if (formData.monthlyBudget) {
      updateData.monthlyBudget = formData.monthlyBudget;
    }

    console.log("💾 Saving profile data:", updateData);

    // Call API
    const result = await updateUserProfile(updateData);

    setIsSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      setIsEditMode(false);

      // Update AuthContext with new data
      login({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        currency: formData.currency,
        isEmailVerified: user.isEmailVerified,
        avatar: formData.avatar,
      });

      // Refresh profile data from API
      const refreshResult = await getProfile();
      if (refreshResult.success && refreshResult.data) {
        const profileData = refreshResult.data;
        setFormData({
          name: profileData.name || formData.name,
          email: profileData.email || formData.email,
          phone: profileData.phone || profileData.profile?.phone || "",
          currency:
            profileData.currency || profileData.profile?.currency || "USD",
          avatar:
            profileData.avatar ||
            profileData.profile?.avatar ||
            profileData.avatarUrl ||
            profileData.profilePicture ||
            profileData.image ||
            "",
          monthlyBudget:
            profileData.monthlyBudget ||
            profileData.profile?.monthlyBudget ||
            0,
        });
        setPreviewAvatar(
          profileData.avatar ||
            profileData.profile?.avatar ||
            profileData.avatarUrl ||
            profileData.profilePicture ||
            profileData.image ||
            "",
        );
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } else {
      setSaveError(result.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewAvatar(result);
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear errors when user types
    if (field === "phone") {
      setPhoneError("");
    }
    setSaveError("");
  };

  const content = (
    <>
      <ProfileHeader isEditMode={isEditMode} onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-400">Loading profile...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <ProfileAvatarSection
              isEditMode={isEditMode}
              previewAvatar={previewAvatar}
              name={formData.name}
              email={formData.email}
              onAvatarClick={() => fileInputRef.current?.click()}
              fileInputRef={fileInputRef}
              onFileChange={handleFileChange}
              onEdit={handleEdit}
            />

            <div className="border-t border-slate-700/30" />

            <ProfileInfoForm
              isEditMode={isEditMode}
              formData={formData}
              onChange={handleInputChange}
              nameInputRef={nameInputRef}
              phoneError={phoneError}
            />

            {saveError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{saveError}</p>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-400">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {isEditMode && (
              <ProfileActions
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
              />
            )}
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onClose}
        showCloseButton={false}
        showHandle={true}
        className="p-0"
      >
        {content}
      </BottomSheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-96 p-0 flex flex-col gap-0 border-l border-slate-700/30"
        showCloseButton={false}
      >
        {content}
      </SheetContent>
    </Sheet>
  );
}
