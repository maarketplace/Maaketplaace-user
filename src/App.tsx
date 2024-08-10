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
      <button className='fixed w-10 h-10 top-5 right-2 bg-[#FFC300]  rounded-full dark:text-black font-semibold flex items-center justify-center z-[1000]'
        onClick={ToggleDarkMode}>
        {userDarkeMode ?
          <MdOutlineLightMode
            className='w-[20px] h-[20px] text-center'
          />
          :
          <MdOutlineNightlight
            className='w-[20px] h-[20px] text-center'
          />}
      </button>
      <Toaster />
    </div>
  )
}

export default App
