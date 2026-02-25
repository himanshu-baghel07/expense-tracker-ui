import LoginFormClient from "./LoginFormClient";

interface LoginFormProps {
  setViewMode: (viewMode: string) => void;
}

const LoginForm = ({ setViewMode }: LoginFormProps) => {
  console.log("Test 2");
  return (
    <div className="w-full max-w-md p-8 bg-black/25 backdrop-blur-md shadow-2xl shadow-blue-400/30 border border-gray-500">
      <h1 className="text-2xl  font-bold text-center mb-8  text-white ">
        Expense Tracker
      </h1>
      <LoginFormClient setViewMode={setViewMode} />
    </div>
  );
};

export default LoginForm;
