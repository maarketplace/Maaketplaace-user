import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getOneProduct } from "../../../api/query";
import { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const Comment = () => {
  const { id: productIdParam } = useParams<{ id?: any }>();

  const [productDetails, setProductDetails] = useState([])
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText(prevText => prevText + emojiData.emoji);
  };

  const { data } = useQuery(['getoneproduct', productIdParam], () => getOneProduct(productIdParam), {})
  useEffect(() => {
    setProductDetails(data?.data?.data?.data?.product?.[0].comments)
    // console.log(productDetails);
  }, [productDetails])
  return (
    <div className="mt-[20px] w-[100%] h-[85vh]">
      <div className="w-full h-[85%]">
        {
          productDetails?.length !== 0 ? (
            <div>
              {
                productDetails?.map(() => (
                  <div></div>
                ))
              }
            </div>
          ) : (
            <div className="w-[100%] h-[100%] flex items-center justify-center">
              <p>No Comments yet for this product</p>
            </div>
          )
        }

      </div>
      <div className="w-full h-[10%] flex items-center justify-center gap-[10px] p-[10px]">
        <span className="w-[90%] flex items-center border h-[35px] p-2 ">
          <button className="w-[30px] h-[20px] text-[20px] flex items-center" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            😊
          </button>
          <input
            type="text"
            placeholder="Add your review"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-[280px] p-2 bg-transparent rounded-md tetx-[10px] outline-none text-black max-w-[650px]:w-[150px] sm:p-[5px]"
          />
        </span>
        {showEmojiPicker && (
          <div className="absolute bottom-[150px] w-[350px]">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <button className="w-[50px] flex items-center">
          <IoMdSend className="w-[35px] h-[35px]" />
        </button>
      </div>

    </div>
  )
}

export default Comment