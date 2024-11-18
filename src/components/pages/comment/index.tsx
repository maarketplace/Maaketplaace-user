import { useState, useRef } from "react";
import { IoMdArrowBack, IoMdClose, IoMdSend } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProductComment, getProductCommentResponse } from "../../../api/query";
import { useEffect } from "react";
import { deleteComment, userComment, userLikeAComment, userReplyComment } from "../../../api/mutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddComment } from "../../../interface/Coment.interface";
import { format } from 'date-fns';
import { yupResolver } from "@hookform/resolvers/yup";
import { CommentSchema } from "../../../schema/CommentsSchema";
import { IoAdd, IoHeart, IoHeartOutline, } from "react-icons/io5";
import { useUser } from "../../../context/GetUser";
import { useAuth } from "../../../context/Auth";
import toast from "react-hot-toast";
import ImageModal from "../../../utils/ImageModal";
// import { RxDotsVertical } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

interface CommentProps {
  productId: string |  null;
}
const Comment = ({ productId }: CommentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id: productIdParam } = useParams<{ id?: any }>();
  const { data: userData } = useUser();
  const { isUserAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [productComment, setProductComment] = useState<IAddComment[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);  // Track selected image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);


  const form = useForm<IAddComment>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(CommentSchema) as any
  });

  const { register, handleSubmit, formState: { errors }} = form;

  const { data: CommentData, isLoading } = useQuery(['getProductComment', productIdParam || productId], () => getProductComment(productIdParam || productId), {});
  const { data: CommentResponse, } = useQuery(
    ['getProductCommentResponse', selectedCommentId],
    () => getProductCommentResponse(selectedCommentId),
    {
      enabled: !!selectedCommentId, // This query will run only when selectedCommentId is set
    }
  );
  useEffect(() => {
    if (CommentResponse) {
      console.log("Replies for the selected comment:", CommentResponse?.data?.data);
    }
  }, [CommentResponse]);
  useEffect(() => {
    if (CommentData) {
      setProductComment(CommentData?.data?.data || []);
    }
  }, [CommentData]);

  const { mutate: deleteMutate } = useMutation(['deleteComment'], deleteComment,)
  const { mutate } = useMutation(['userComment'], userComment, {
    onSuccess: () => {
      setSelectedImage(null);
    },
    onError: (err) => {
      console.log(err);
    }
  });
  const { mutate: mutateReply } = useMutation(['userReplyComment'], userReplyComment, {
    onSuccess: () => {
      setReplyTo(null); // Reset the replyingTo state after success
      setSelectedCommentId(null);
    },
    onError: (err) => {
      console.log(err);
    }
  });
  const handlePlusIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  // const handleReplyClick = (commentId: string, userName: string) => {
  //   setReplyTo(userName);
  //   setSelectedCommentId(commentId);
  //   setValue("comment", `@${userName} `);
  // };
  const onSubmit: SubmitHandler<IAddComment> = (formData) => {
    const currentTime = format(new Date(), 'HH:mm a');
    const temporaryId = Date.now();
    const comment = formData.comment

    const newComment: IAddComment = {
      id: temporaryId,
      comment: formData.comment,
      createdTime: currentTime,
      productIdParam: undefined,
      user: {
        fullName: userData?.fullName || "",
        _id: ''
      },
      _id: "",
      total_likes: 0,
      user_likes: [],
      image: imagePreviewUrl
    };

    const formDataToSend = new FormData();

    if (formData.comment) {
      formDataToSend.append("comment", formData.comment);
    }

    // Append the image if provided
    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }
    if (!formData.comment && !selectedImage) {
      toast.error("Please provide either a comment or an image");
      return;
    }
    setProductComment((prevComments) => [...prevComments, newComment]);

    if (replyTo) {
      formDataToSend.append("replyTo", replyTo);  // Include the name of the person you're replying to
      // Call your reply API instead of the normal comment API
      mutateReply({ id: selectedCommentId, comment });
    } else {
      // Normal comment submission
      mutate(
        { id: productIdParam, formData: formDataToSend },
        {
          onSuccess: (response) => {
            const actualComment = response.data.comment;

            setProductComment((prevComments) =>
              prevComments.map((comment) =>
                comment?.id === temporaryId ? { ...comment, ...actualComment } : comment
              )
            );
          },
          onError: (err) => {
            console.error('Error:', err);
            setProductComment((prevComments) =>
              prevComments.filter((comment) => comment?.id !== temporaryId)
            );
          },
        }
      );
    }



    form.reset({ comment: '' });
  };


  const handleComment = () => {
    handleSubmit(onSubmit)();
    setSelectedImage(null);
    setImagePreviewUrl(null);
  };

  const loggedInUserId = userData?._id;

  const { mutate: likeCommentMutate } = useMutation(['userLikeAComment',], userLikeAComment, {});

  const handleCommentLik = async (commentId: string) => {
    if (isUserAuthenticated) {
      const updatedComments = [...productComment];
      const commentIndex = updatedComments.findIndex((comment) => comment?._id === commentId);

      if (commentIndex !== -1) {
        const comment = updatedComments[commentIndex];
        const isLiked = comment.user_likes?.includes(loggedInUserId);
        if (!isLiked) {
          comment.total_likes = (comment?.total_likes || 0) + 1;
          comment.user_likes = [...(comment?.user_likes || []), loggedInUserId];
          likeCommentMutate(commentId);
        } else {
          comment.total_likes = (comment?.total_likes || 0) - 1;
          comment.user_likes = (comment?.user_likes || []).filter((userId: string) => userId !== loggedInUserId);
          likeCommentMutate(commentId);
        }
        setProductComment(updatedComments);
      }
    } else {
      toast.error("Please login to like this Comment");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };
  const handleImageClick = (imageUrl: string | null) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalImageUrl(null);
    setIsModalOpen(false);
  };
  const handleDeleteComment = (id: string) => {
    deleteMutate(id);
    setProductComment((prevComments) => [...prevComments]);
  };
  return (
    <div className={location.pathname === '/home/quicks' ? ' w-[100%] flex flex-col items-center justify-between h-[100vh] dark:bg-black dark:text-white no-scrollbar ' : 'mt-[20px] w-[100%] flex flex-col items-center justify-between h-[85vh] dark:bg-black dark:text-white no-scrollbar'}>
      <div className="flex h-[] w-[45%] items-center max-[650px]:w-[100%] justify-between p-2 bg-white dark:bg-black">
        <IoMdArrowBack onClick={() => navigate('/home')} className={location.pathname === '/home/quicks' ? 'hidden' : ''} />
        <p>{productComment?.length} Comments</p>
      </div>
      <div className="w-[45%] h-[80%] max-[650px]:w-[100%] overflow-y-auto justify-center items-center">
        {isLoading ? (
          <div className="w-[100%] h-[90%] mt-[30px] flex flex-col items-center justify-center">
            {Array.from(new Array(7)).map((_, index) => (
              <div key={index} className='w-[280px] h-[500px] shadow-sm rounded-lg p-[10px] flex flex-col gap-[10px] max-[650px]:w-[100%]'>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Skeleton variant="circular" width="30px" height='30px' className='dark:bg-[grey] mt-[10px]' />
                  <Skeleton width="70%" className='dark:bg-[grey] mt-[10px]' />
                  <Skeleton variant="circular" width="20px" height='20px' className='dark:bg-[grey] mt-[10px]' />
                </Box>
              </div>
            ))}
          </div>
        ) : productComment.length !== 0 ? (
          <div className="w-[100%] flex flex-col  gap-[10px]">
            {productComment
              .filter((comment) => comment !== null && comment?.comment !== '' && comment?.user !== null) // Filter out null or empty comments
              .map((i: IAddComment) => (
                <div key={i?._id} className="justify-center items-center">
                  <div className="flex items-center justify-between p-2 gap-2">
                    <span className="h-[28px] w-[30px] flex items-center justify-center bg-[#FFC300] rounded-full">
                      <p>{i?.user?.fullName?.charAt(0)}</p>
                    </span>
                    <span className="w-[80%] flex flex-col gap-1">
                      <p className="text-[14px] font-bold">
                        {i?.user?.fullName} <b className="font-light">{i?.createdTime}</b>
                      </p>
                      <p className="text-[12px]">{i?.comment}</p>
                      {i?.image && (
                        <img
                          src={i?.image}
                          alt="Comment"
                          className="w-[50px] h-[50px] object-cover"
                          onClick={() => handleImageClick(i?.image)}
                        />
                      )}
                      {/* <p
                        onClick={() => handleReplyClick(i?._id, i.user?.fullName || '',)}
                        className="reply-button text-[10px] text-blue-500"
                      >
                        Reply
                      </p> */}
                    </span>
                    <span className="flex flex-col justify-center items-center">
                      {i?.user_likes?.includes(loggedInUserId) ? (
                        <IoHeart
                          className="text-[#FFC300] text-[15px]"
                          onClick={() => handleCommentLik(i?._id)}
                        />
                      ) : (
                        <IoHeartOutline
                          className="text-[15px] text-[#FFC300]"
                          onClick={() => handleCommentLik(i?._id)}
                        />
                      )}
                      <p className="text-[12px]">{i?.total_likes}</p>
                    </span>
                    {i.user?._id === loggedInUserId && (
                         <span>
                         <MdDeleteOutline onClick={() => handleDeleteComment(i?._id)} className="text-red-500" />
                       </span>
                    )}
               
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
      {imagePreviewUrl && (
        <div className="w-[90%] flex items-center absolute bottom-[90px] left-2 ">
          <img src={imagePreviewUrl} alt="Preview" className="w-[80px] h-[80px] object-cover mb-4 " />
          <IoMdClose
            className="absolute top-0 right-[120px] text-[25px] text-red-500 rounded-full cursor-pointer"
            onClick={handleCancelImage}
          />
        </div>
      )}
      { 
        isModalOpen && modalImageUrl && (
          <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />
        )
      }
      <div className="w-[40%] mb-[60px] max-[650px]:mt-[40px] h-[10%] max-[650px]:w-[100%] flex items-center justify-center flex-col gap-[5px] max-[650px]:bg-white dark:bg-black">
        <div className="flex gap-[5px] w-[100%] items-center border max-[650px]:w-[96%]">
          <button className="flex items-center" onClick={handlePlusIconClick}>
            <IoAdd className="text-[20px] max-[650px]:text-[black] dark:text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="w-[90%] flex items-center justify-center h-[35px] p-2 max-[650px]:w-[99%]">
            <input
              placeholder={replyTo ? `Replying to ${replyTo}...` : "Add a review"}
              {...register('comment')}
              className="w-[100%] flex items-center justify-center p-2 bg-transparent  text-[10px] outline-none text-black max-[650px]:w-[100%] sm:p-[5px] dark:text-white max-[650px]:text-black"
            />
            <b className="">{errors.comment?.message}</b>
          </span>
          <button className="w-[10%] flex items-center" onClick={handleComment}>
            <IoMdSend className="text-[25px] max-[650px]:text-[black] dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;


