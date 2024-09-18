import { Outlet } from "react-router-dom";

interface LayoutProps {
  searchQuery: string; 
}

const Layout: React.FC<LayoutProps> = ({ searchQuery }) => {
  return (
    <div className="p-0 dark:bg-black w-full">
      <Outlet  context={{ searchQuery }}/>
    </div>
  );
};

export default Layout;
