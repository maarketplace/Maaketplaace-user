import { useState } from "react";
import { IoMdArrowBack, IoMdSend } from "react-icons/io";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { getOneProduct } from "../../../api/query";
import { useEffect } from "react";
import { userComment, userLikeAComment } from "../../../api/mutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddComment } from "../../../interface/Coment.interface";
import { format } from 'date-fns';
import { yupResolver } from "@hookform/resolvers/yup";
import { CommentSchema } from "../../../schema/CommentsSchema";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useUser } from "../../../context/GetUser";

const Comment = () => {
  const { id: productIdParam } = useParams<{ id?: any }>();
  const { data: userData } = useUser();
  const queryClient = useQueryClient();
  const commentQuery = ["getoneproduct"];
  const [productDetails, setProductDetails] = useState<IAddComment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const form = useForm<IAddComment>({
    resolver: yupResolver(CommentSchema) as any
  });

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = form;

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentComment = (getValues('comment') as string) || "";
    setValue('comment', currentComment + emojiData.emoji);
  };

  const { data, isLoading } = useQuery(['getoneproduct', productIdParam], () => getOneProduct(productIdParam), {});

  useEffect(() => {
    setProductDetails(data?.data?.data?.data?.product?.[0].comments || []);
    // console.log(productDetails);

  }, [productDetails]);

  const { mutate } = useMutation(['comment'], userComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(commentQuery);
    },
    onError: (err) => {
      console.log(err);
    }
  });


  const onSubmit: SubmitHandler<IAddComment> = (data) => {
    const currentTime = format(new Date(), 'HH:mm a');
    const newComment: IAddComment = {
      id: Date.now(),
      comment: data.comment,
      createdTime: currentTime,
      productIdParam: undefined,
      user: [],
      _id: "",
      total_likes: 0
    };
    setProductDetails([...productDetails, newComment]);
    form.reset({ comment: '' });
    mutate({ id: productIdParam, comment: data.comment });
  };


  const handleComment = () => {
    handleSubmit(onSubmit)();
  };
  const loggedInUserId = userData?._id;
  const { mutate: likeCommentMutate } = useMutation(
    ['userLikeAComment'],
    userLikeAComment,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(commentQuery)
        console.log(data);

      },
      onError: (err) => console.log('Error:', err),
    }
  );
  const handleLikeClick = async (commentId: string) => {
    const updatedComments = productDetails.map((comment) => {
      if (comment._id === commentId) {
        const isLiked = comment.user.includes(loggedInUserId);

        return {
          ...comment,
          total_likes: isLiked ? comment.total_likes - 1 : comment.total_likes + 1,
          user: isLiked
            ? comment.user.filter(userId => userId !== loggedInUserId) // Unlike
            : [...comment.user, loggedInUserId], // Like
        };
      }
      return comment;
    });

    setProductDetails(updatedComments);

    likeCommentMutate(commentId, {
      onError: (err) => {
        console.log("Error:", err);
        setProductDetails(productDetails); // Revert to original state on error
      },
    });
  };


  return (
    <div className="mt-[20px] w-[100%] h-[85vh] dark:bg-black dark:text-white">
      <div className="flex w-[50%] max-[650px]:w-[100%] justify-between p-2 bg-white dark:bg-black">
        <IoMdArrowBack

        />
        <p>{productDetails?.length} Comments</p>
      </div>
      <div className="w-[50%] h-[70%] max-[650px]:w-[100%] overflow-y-auto">
        {
          isLoading ?
            <div className="w-[100%] h-[80vh] flex items-center justify-center">
              <p>Loading Comments....</p>
            </div>
            :
            productDetails.length !== 0 ? (
              <div className="w-[100%] flex flex-col gap-[10px]">
                {productDetails.map((i: IAddComment) => (
                  <div key={i._id} >
                    <div className=" flex items-center justify-between p-2 gap-2 ">
                      <span className="w-[30px] h-[30px] bg-red-300 rounded-full">

                      </span>
                      <span className="w-[80%] flex flex-col gap-1">
                        <p className="text-[12px] font-bold">Suliton <b className="font-light">{i?.createdTime}</b></p>
                        <p className="text-[10px]">{i?.comment}</p>
                        <p className="text-[8px]">Reply</p>
                      </span>
                      <span className="flex flex-col justify-center items-center">
                        {
                          i?.user.includes(loggedInUserId) ? (
                            <IoHeart
                              className='text-[#FFC300] text-[15px]'
                              onClick={() => handleLikeClick(i?._id)}
                            />
                          ) : (
                            <IoHeartOutline
                              className='text-[15px] text-[#FFC300]'
                              onClick={() => handleLikeClick(i?._id)}
                            />
                          )
                        }
                        <p className="text-[12px]">{i?.total_likes}</p>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-[100%] h-[100%] flex items-center justify-center">
                <p>No Comments yet for this product</p>
              </div>
            )}
      </div>
      <div className="w-[55%] max-[650px]:w-[100%] h-[25%] sm:[320px]:mb-[30px] flex items-center justify-center gap-[10px] p-[10px]">
        <span className="w-[90%] flex items-center border h-[35px] p-2">
          <button className="w-[30px] h-[20px] text-[20px] flex items-center" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            😊
          </button>
          <input
            placeholder="Add your review"
            {...register('comment')}
            className="w-[280px] flex items-center justify-center p-2 bg-transparent rounded-md text-[10px] outline-none text-black max-w-[650px]:w-[150px] sm:p-[5px] dark:text-white"
          />
          <b className='upload_product_error_msg'>{errors.comment?.message}</b>
        </span>
        {showEmojiPicker && (
          <div className="absolute bottom-[150px] w-[350px] max-[650px]:w-[300px]">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <button className="w-[50px] flex items-center" onClick={handleComment}>
          <IoMdSend className="text-[25px]" />
        </button>
      </div>
    </div>
  );
};

export default Comment;
