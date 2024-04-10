"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import sun from "../../assest/sun.svg";
import moon from "../../assest/moon.png";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (mounted)
    return (
      <Image
        style={{
          cursor: "pointer",
          position: "fixed",
          top: "50%",
          right: "0",
        }}
        src={resolvedTheme === "dark" ? sun : moon}
        width={36}
        height={36}
        sizes="36x36"
        alt="Loading Light/Dark Toggle"
        priority={false}
        title="Loading Light/Dark Toggle"
        onClick={() =>
          resolvedTheme === "dark" ? setTheme("light") : setTheme("dark")
        }
      />
    );
}
