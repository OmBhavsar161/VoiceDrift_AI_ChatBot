import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);

    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold">VoiceDrift AI ChatBot</h1>
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
