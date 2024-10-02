const ImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="relative w-[400px] h-[400px] flex items-center justify-center max-[650px]:w-[100%] max-[650px]:h-[50%]">
          <img src={imageUrl} alt="Large view" className="max-w-[90%] max-h-[90%] max-[650px]:w-[80%] object-contain" />
          <button onClick={onClose} className="absolute top-2 right-0 text-white text-2xl">
            &times;
          </button>
        </div>
      </div>
    );
  };
export default ImageModal  