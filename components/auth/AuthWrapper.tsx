"use client";

import { images } from "@/utils/images";
import dynamic from "next/dynamic";
import { useState } from "react";
const LoginForm = dynamic(() => import("./LoginForm"));
const SignupForm = dynamic(() => import("./SignupForm"));

export const AuthWrapper = () => {
  const [viewMode, setViewMode] = useState("login");

  const currentViewMode = () => {
    if (viewMode === "login") return <LoginForm setViewMode={setViewMode} />;
    else if (viewMode === "signup")
      return <SignupForm setViewMode={setViewMode} />;
  };

  return (
    <div
      className="h-screen w-full flex justify-center items-center bg-cover "
      style={{ backgroundImage: `url(${images.bgImage.src})` }}
    >
      {currentViewMode()}
    </div>
  );
};
