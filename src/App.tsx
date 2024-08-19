import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useContext, useEffect } from 'react';
import { UserThemeContext } from './context/DarkTheme';
import { MdOutlineLightMode, MdOutlineNightlight } from 'react-icons/md';
import { Toaster } from 'react-hot-toast';

function App() {
  const { userDarkeMode, ToggleDarkMode } = useContext(UserThemeContext);

  // Apply the dark class to the html element
  useEffect(() => {
    if (userDarkeMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userDarkeMode]);

  return (
    <div className="min-h-screen">
      {/* Router */}
      <RouterProvider router={router} />

      {/* Toggle Button */}
      <button
        className="fixed w-[35px] h-[35px] bottom-4 right-1 bg-[#FFC300] rounded-full dark:text-black font-semibold flex items-center justify-center z-[1001] max-[650px]:w-[25px] max-[650px]:h-[25px]"
        onClick={ToggleDarkMode}
      >
        {userDarkeMode ? (
          <MdOutlineLightMode className="w-[15px] h-[15px] text-center" />
        ) : (
          <MdOutlineNightlight className="w-[15px] h-[15px] text-center" />
        )}
      </button>

      {/* Toaster Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
