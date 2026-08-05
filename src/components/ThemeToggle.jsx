"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "", style = {} }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button onClick={toggle} className={className} style={style}>
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
