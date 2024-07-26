"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import Layout from "@/components/Layout";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('/api/user/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log("Login successful", data);
      
      router.push('/kalendar');
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <Layout><div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-20 sm:py-32 relative overflow-hidden">
    <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2400px] lg:h-[800px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>
    <motion.div 
      className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-lg bg-black bg-opacity-50 backdrop-blur-md relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="font-bold text-3xl text-white mb-2">
        Welcome Back to Kalendar
      </h2>
      <p className="text-purple-200 text-sm max-w-sm mb-8">
        Log in to continue optimizing your daily routine with AI-powered insights
      </p>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="email" className="text-purple-200">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-purple-900 bg-opacity-50 border-purple-500 text-white placeholder-purple-300"
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password" className="text-purple-200">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-purple-900 bg-opacity-50 border-purple-500 text-white placeholder-purple-300"
          />
        </LabelInputContainer>

        <motion.button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
        >
          Log in &rarr;
        </motion.button>
      </form>

      <div className="my-8 flex items-center">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        <span className="px-4 text-sm text-purple-300">or</span>
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      </div>

      <div className="flex flex-col space-y-4">
        <motion.button
          className="flex items-center justify-center space-x-2 w-full text-white rounded-full py-3 px-8 font-medium bg-purple-900 bg-opacity-50"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {/* Implement GitHub login */}}
          type="button"
        >
          <IconBrandGithub className="h-5 w-5" />
          <span>Continue with GitHub</span>
        </motion.button>
        <motion.button
          className="flex items-center justify-center space-x-2 w-full text-white rounded-full py-3 px-8 font-medium bg-purple-900 bg-opacity-50"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {/* Implement Google login */}}
          type="button"
        >
          <IconBrandGoogle className="h-5 w-5" />
          <span>Continue with Google</span>
        </motion.button>
      </div>

      <div className="mt-8 text-center">
        <Link href="/user/auth/signup" className="text-purple-300 hover:text-white transition-colors">
          Not signed up? Create an account
        </Link>
      </div>
    </motion.div>
  </div></Layout>
  );
};

const LabelInputContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default LoginForm;