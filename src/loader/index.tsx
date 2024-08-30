import Loader from './loader.svg'
const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
        <img src={Loader} alt="loading" className="w-[25px] h-[25px] rounded-full" />
    </div>
  )
}

export default Loading