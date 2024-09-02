import { createContext, useContext } from "react";

type sidebarStatus = {
  active: boolean,
  expanded: boolean,
  setActive: React.Dispatch<React.SetStateAction<boolean>>,
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
}
export const SidebarContext = createContext<sidebarStatus | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSideBarContext must be used within a SideBarProvider");
  }

  return context;
};