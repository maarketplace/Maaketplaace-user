import { Outlet } from "react-router-dom";

interface LayoutProps {
  searchQuery: string; 
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="p-0 dark:bg-black w-full  no-scrollbar">
      <Outlet />
    </div>
  );
};

export default Layout;
