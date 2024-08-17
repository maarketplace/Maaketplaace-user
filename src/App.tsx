import { RouterProvider } from 'react-router-dom'
import router from './router'
import { useContext } from 'react';
import { UserThemeContext } from './context/DarkTheme';
import { MdOutlineLightMode, MdOutlineNightlight } from 'react-icons/md';
import { Toaster } from 'react-hot-toast';
function App() {
  const { userDarkeMode, ToggleDarkMode } = useContext(UserThemeContext);
  return (
    <div className={`${userDarkeMode && "dark"} bg-white dark:bg-black`}>
      <RouterProvider router={router} />
      <button className='fixed w-20 h-20 bottom-4 right-1 bg-[#FFC300] rounded-full dark:text-black font-semibold flex items-center justify-center z-[1001] max-[650px]:w-[25px] max-[650px]:h-[25px]'
        onClick={ToggleDarkMode}>
        {userDarkeMode ?
          <MdOutlineLightMode
            className='w-[15px] h-[15px] text-center'
          />
          :
          <MdOutlineNightlight
            className='w-[15px] h-[15px] text-center'
          />}
      </button>
      <Toaster />
    </div>
  )
}

export default App
