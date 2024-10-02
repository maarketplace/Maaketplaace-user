import { useState, useRef } from "react";
import { IoMdArrowBack, IoMdClose, IoMdSend } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProductComment } from "../../../api/query";
import { useEffect } from "react";
import { userComment, userLikeAComment } from "../../../api/mutation";
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

const Comment = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id: productIdParam } = useParams<{ id?: any }>();
  const { data: userData } = useUser();
  const { isUserAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [productComment, setProductComment] = useState<IAddComment[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);  // Track selected image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const form = useForm<IAddComment>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(CommentSchema) as any
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const { data: CommentData, isLoading } = useQuery(['getProductComment', productIdParam], () => getProductComment(productIdParam), {});

  useEffect(() => {
    if (CommentData) {
      setProductComment(CommentData?.data?.data || []);
    }
  }, [CommentData]);

  const { mutate } = useMutation(['comment'], userComment, {
    onSuccess: () => {
      setSelectedImage(null);  // Reset image after successful upload
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
    setSelectedImage(null);  // Clear the selected image
    setImagePreviewUrl(null);  // Remove the preview URL
    if (fileInputRef.current) {
      fileInputRef.current.value = '';  // Reset file input field
    }
  };
  const onSubmit: SubmitHandler<IAddComment> = (formData) => {
    const currentTime = format(new Date(), 'HH:mm a');
    const temporaryId = Date.now();

    const newComment: IAddComment = {
      id: temporaryId,
      comment: formData.comment, // This is just the text comment
      createdTime: currentTime,
      productIdParam: undefined,
      user: {
        fullName: userData?.fullName || ""
      },
      _id: "",
      total_likes: 0,
      user_likes: [],
      image: imagePreviewUrl
    };

    setProductComment((prevComments) => [...prevComments, newComment]);

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append("comment", formData.comment);
    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }

    mutate(
      { id: productIdParam, formData: formDataToSend },  // Pass the FormData object
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
      const commentIndex = updatedComments.findIndex((comment) => comment._id === commentId);

      if (commentIndex !== -1) {
        const comment = updatedComments[commentIndex];
        const isLiked = comment.user_likes?.includes(loggedInUserId);
        if (!isLiked) {
          comment.total_likes = (comment.total_likes || 0) + 1;
          comment.user_likes = [...(comment.user_likes || []), loggedInUserId];
          likeCommentMutate(commentId);
        } else {
          comment.total_likes = (comment.total_likes || 0) - 1;
          comment.user_likes = (comment.user_likes || []).filter((userId: string) => userId !== loggedInUserId);
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
  return (
    <div className="mt-[20px] w-[100%] flex flex-col items-center justify-between h-[85vh] dark:bg-black dark:text-white">

      <div className="flex h-[] w-[50%] items-center max-[650px]:w-[100%] justify-between p-1 bg-white dark:bg-black">
        <IoMdArrowBack onClick={() => navigate('/home')} />
        <p>{productComment?.length} Comments</p>
      </div>
      <div className="w-[50%] h-[80%] max-[650px]:w-[100%] overflow-y-auto">
        {isLoading ? (
          <div className="w-[100%] h-[80vh] flex items-center justify-center">
            <p>Loading Comments....</p>
          </div>
        ) : productComment.length !== 0 ? (
          <div className="w-[100%] flex flex-col gap-[10px]">
            {productComment.map((i: IAddComment) => (
              <div key={i._id}>
                <div className="flex items-center justify-between p-4 gap-2">
                  <span className="w-[30px] flex items-center justify-center h-[30px] bg-[#FFC300] rounded-full">
                    <p>{i?.user?.fullName?.charAt(0)}</p>
                  </span>
                  <span className="w-[80%] flex flex-col gap-1">
                    <p className="text-[14px] font-bold">
                      {i?.user?.fullName} <b className="font-light">{i?.createdTime}</b>
                    </p>
                    <p className="text-[12px]">{i?.comment}</p>
                    {i?.image && <img
                      src={i?.image}
                      alt="Comment"
                      className="w-[50px] h-[50px] object-cover"
                      onClick={() => handleImageClick(i?.image)}
                    />}
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
        <div className="w-full flex items-center relative">
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
      <div className="w-[55%] mb-[20px] h-[10%] max-[650px]:w-[100%] flex items-center justify-center flex-col gap-[5px] max-[650px]:bg-white dark:bg-black">
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
              placeholder="Add your review"
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


