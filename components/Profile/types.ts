export interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    phone?: string;
    currency?: string;
    isEmailVerified: boolean;
    avatar?: string;
  };
}
export interface ProfileAvatarSectionProps {
  isEditMode: boolean;
  previewAvatar: string;
  name: string;
  email: string;
  onAvatarClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
}
export interface ProfileInfoFormProps {
  isEditMode: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    currency: string;
    monthlyBudget?: number;
  };
  onChange: (field: string, value: string) => void;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  phoneError?: string;
}
