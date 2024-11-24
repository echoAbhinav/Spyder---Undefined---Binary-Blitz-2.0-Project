import { createContext, useState, useEffect } from "react";

export const DarkModeContext = createContext(null);

const updateMetaThemeColor = (color) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", color);
  }
};

export const DarkModeContextProvider = ({ children }) => {
  // Initialize state with a function to read from local storage
  const [DarkMode, setDarkMode] = useState(() => {
    const theme = localStorage.getItem("theme");
    return theme === "dark" ? true : false;
  });

  useEffect(() => {
    // Update local storage whenever DarkMode changes
    localStorage.setItem("theme", DarkMode ? "dark" : "light");
    const themeColor = DarkMode ? "#000000" : "#ffffff";
    updateMetaThemeColor(themeColor);

    // Added the code below because the modal's theme was not working properly. It will apply the light and dark theme directly on the body element.
    document
      .querySelector("body")
      ?.classList.add("text-foreground", "bg-background");

    DarkMode
      ? (document.querySelector("body").classList.add("dark"),
        document.querySelector("body").classList.remove("light"))
      : (document.querySelector("body").classList.remove("dark"),
        document.querySelector("body").classList.add("light"));
  }, [DarkMode]);

  return (
    <DarkModeContext.Provider value={{ DarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
