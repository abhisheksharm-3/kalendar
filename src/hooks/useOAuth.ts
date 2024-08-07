import { useState } from 'react';
import { signUpWithGoogle } from "@/lib/server/oAuthFunctions";
import { getLoggedInUser } from "@/lib/server/appwrite";

export const useAuth = () => {
  const [error, setError] = useState<string>("");

  const handleGoogleSignUp = async () => {
    try {
      await signUpWithGoogle();
      const res = await getLoggedInUser();
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message);
    }
  };

  return {
    signUpWithGoogle: handleGoogleSignUp,
    error,
  };
};