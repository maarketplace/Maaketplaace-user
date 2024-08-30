import { useState } from "react";
import { IoMdArrowBack, IoMdSend } from "react-icons/io";
// import  { EmojiStyle, SkinTones } from 'emoji-picker-react';
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getOneProduct, getProductComment } from "../../../api/query";
import { useEffect } from "react";
import { userComment, userLikeAComment } from "../../../api/mutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddComment } from "../../../interface/Coment.interface";
import { format } from 'date-fns';
import { yupResolver } from "@hookform/resolvers/yup";
import { CommentSchema } from "../../../schema/CommentsSchema";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useUser } from "../../../context/GetUser";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const Comment = () => {
  const { id: productIdParam } = useParams<{ id?: any }>();
  const { data: userData } = useUser();
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const commentQuery = ["getoneproduct"];
  const [productComment, setProductComment] = useState<IAddComment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const form = useForm<IAddComment>({
    resolver: yupResolver(CommentSchema) as any
  });

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = form;

  const onEmojiClick = (emoji: { native: string; }) => {
    const currentComment = getValues('comment') || "";
    setValue('comment', currentComment + emoji.native);
  };

  const { data: ProductData, isLoading } = useQuery(['getoneproduct', productIdParam], () => getOneProduct(productIdParam), {});
  const { data: CommentData } = useQuery(['getProductComment', productIdParam], () => getProductComment(productIdParam), {});

  useEffect(() => {
    if (ProductData) {
      setProductComment(CommentData?.data?.data || []);
      // console.log(CommentData?.data?.data);
    }
  }, [ProductData]);

  const { mutate } = useMutation(['comment'], userComment, {
    onSuccess: () => {
    },
    onError: (err) => {
      console.log(err);
    }
  });


  const onSubmit: SubmitHandler<IAddComment> = (formData) => {
    const currentTime = format(new Date(), 'HH:mm a');
    const temporaryId = Date.now();
    const newComment: IAddComment = {
      id: temporaryId,
      comment: formData.comment,
      createdTime: currentTime,
      productIdParam: undefined,
      user: {
        fullName: ""
      },
      _id: "",
      total_likes: 0,
      user_likes: undefined
    };
    setProductComment((prevComments) => [...prevComments, newComment]);
    form.reset({ comment: '' });
    mutate(
      { id: productIdParam, comment: formData.comment },
      {
        onSuccess: (response) => {
          const actualComment = response.data.comment;
          setProductComment((prevComments) =>
            prevComments.map((comment) =>
              comment.id === temporaryId ? { ...comment, ...actualComment } : comment
            )
          );
        },
        onError: (err) => {
          console.error('Error:', err);
          setProductComment((prevComments) =>
            prevComments.filter((comment) => comment.id !== temporaryId)
          );
        },
      }
    );
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
    const updatedComments = productComment.map((comment) => {
      if (comment._id === commentId) {
        const isLiked = comment.user_likes.includes(loggedInUserId);

        return {
          ...comment,
          total_likes: isLiked ? comment.total_likes - 1 : comment.total_likes + 1,
          user: isLiked
            ? comment.user_likes.filter((userId: any) => userId !== loggedInUserId) // Unlike
            : [...comment.user_likes, loggedInUserId], // Like
        };
      }
      return comment;
    });

    setProductComment(updatedComments);

    likeCommentMutate(commentId, {
      onError: (err) => {
        console.log("Error:", err);
        setProductComment(productComment);
      },
    });
  };


  return (
    <div className="mt-[20px] w-[100%] flex flex-col items-center justify-between h-[85vh] dark:bg-black dark:text-white">
      <div className="flex h-[40px] w-[50%] items-center max-[650px]:w-[100%] justify-between p-1 bg-white dark:bg-black">
        <IoMdArrowBack
          onClick={() => navigate('/home')}
        />
        <p>{productComment?.length} Comments</p>
      </div>
      <div className="w-[50%] h-[70%] max-[650px]:w-[100%] overflow-y-auto">
        {
          isLoading ?
            <div className="w-[100%] h-[80vh] flex items-center justify-center">
              <p>Loading Comments....</p>
            </div>
            :
            productComment.length !== 0 ? (
              <div className="w-[100%] flex flex-col gap-[10px]">
                {productComment.map((i: IAddComment) => (
                  <div key={i._id} >
                    <div className=" flex items-center justify-between p-4 gap-2 ">
                      <span className="w-[30px] flex items-center justify-center h-[30px] bg-[#FFC300] rounded-full">
                        <p>{i?.user?.fullName?.charAt(0)}</p>
                      </span>
                      <span className="w-[80%] flex flex-col gap-1">
                        <p className="text-[12px] font-bold">{i?.user?.fullName} <b className="font-light">{i?.createdTime}</b></p>
                        <p className="text-[10px]">{i?.comment}</p>
                        {/* <p className="text-[8px]">Reply</p> */}
                      </span>
                      <span className="flex flex-col justify-center items-center">
                        {
                          i?.user_likes?.includes(loggedInUserId) ? (
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
      <div className="w-[55%] h-[25%] max-[650px]:w-[100%] flex items-center justify-center flex-col gap-[10px] max-[650px]:bg-black ">
        <div className=" flex w-[100%] flex-col items-center justify-center max-[650px]:w-[100%] mb-[40px] bg-white max-[650px]:bg-black ">
          <div className="flex gap-5 w-[90%]  justify-between items-center border max-[650px]:w-[96%]">
            <span className="w-[100%] flex items-center justify-center  h-[35px] p-2 max-[650px]:w-[99%]">
              <button className="w-[30px] h-[20px] text-[20px] flex items-center" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                😊
              </button>
              <input
                placeholder="Add your review"
                {...register('comment')}
                className="w-[90%] flex items-center  justify-center p-2 bg-transparent rounded-md text-[10px] outline-none text-black max-[650px]:w-[100%] sm:p-[5px] dark:text-white"
              />
              <b className=''>{errors.comment?.message}</b>
            </span>

            <button className="w-[10%] flex items-center " onClick={handleComment}>
              <IoMdSend className="text-[25px] max-[650px]:text-[white]" />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="w-[100%] h-[70%] overflow-hidden flex justify-center bg-black max-[650px]:mt-[20px]">
              <Picker
                // width='300px'
                data={data}
                onEmojiSelect={onEmojiClick}
                reactionsDefaultOpen={true}
                theme="auto"
                height='200'
                width={400}
                previewPosition='none'
                dynamicWidth={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
