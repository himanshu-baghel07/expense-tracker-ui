import SignupFormClient from "./SignupFormClient";

interface SignupFormProps {
  setViewMode: (viewMode: string) => void;
}

const SignupForm = ({ setViewMode }: SignupFormProps) => {
  return (
    <div className="w-full max-w-md p-8 bg-black/25 backdrop-blur-md shadow-2xl shadow-blue-400/30 border border-gray-500">
      <h1 className="text-2xl font-bold text-center mb-8 text-white">
        Create Account
      </h1>
      <SignupFormClient setViewMode={setViewMode} />
    </div>
  );
};

export default SignupForm;
