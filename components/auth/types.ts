export interface FormState {
  email: string;
  password: string;
}

export interface SignupFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginFormUI {
  form: FormState;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isLoading?: boolean;
}

export interface ISignupFormUI {
  form: SignupFormState;
  onSubmit: (e: React.FormEvent) => void;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  error?: string;
  isLoading?: boolean;
}
