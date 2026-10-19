import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("theme");
    } catch {
      // storage can be blocked (private mode, strict settings): fall back to light
    }
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore: the choice just won't be remembered
    }
  };

  return (
    <label className="dark-toggle-switch">
      <input
        className="dark-toggle-input"
        type="checkbox"
        checked={dark}
        onChange={toggle}
      />
      <span className="dark-toggle-slider" />
    </label>
  );
};

export default DarkModeToggle;
