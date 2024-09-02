import { useState } from "react";
import AdminRoutes from "./Admin/AdminRoutes";
import ThemeContext, { Theme } from "./Contexts/ThemeContext";

function App() {
  const [theme, setTheme] = useState<Theme>("autumn");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <AdminRoutes />
    </ThemeContext.Provider>
  );
}

export default App;
