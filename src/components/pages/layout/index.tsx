import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="p-0 dark:bg-black">
        <Outlet/>
    </div>
  )
}

export default Layout