"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Particles from "@/components/magicui/particles";
import AnimatedShinyText from "./magicui/animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";

const Hero = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
    console.log(theme);
  }, [theme]);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <div className="z-10 flex min-h-[16rem] items-center justify-center">
        <div className="group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Sign Up to hear about us</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Boost Your Productivity
      </span>
      <span>
        Streamline your workflow and get more done with our powerful
        productivity tools.
      </span>
      <Particles
        className="absolute inset-0"
        quantity={50}
        ease={80}
        color={color}
        refresh
      />
    </div>
  );
};

export default Hero;
