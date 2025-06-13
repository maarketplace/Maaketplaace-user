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
import { IoAdd, IoHeart, IoHeartOutline, IoImageOutline } from "react-icons/io5";
import { useUser } from "../../../context/GetUser";
import { useAuth } from "../../../context/Auth";
import toast from "react-hot-toast";
import ImageModal from "../../../utils/ImageModal";
import { MdDeleteOutline, MdReply } from "react-icons/md";
import Skeleton from '@mui/material/Skeleton';

interface CommentProps {
  productId: string | null;
}

const Comment = ({ productId }: CommentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id: productIdParam } = useParams<{ id?: any }>();
  const { user: userData } = useUser();
  const { isUserAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [productComment, setProductComment] = useState<IAddComment[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IAddComment>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(CommentSchema) as any
  });

  const { register, handleSubmit, formState: { errors }, watch } = form;
  const commentText = watch('comment');

  const { data: CommentData, isLoading } = useQuery(['getProductComment', productIdParam || productId], () => getProductComment(productIdParam || productId), {});
  const { data: CommentResponse } = useQuery(
    ['getProductCommentResponse', selectedCommentId],
    () => getProductCommentResponse(selectedCommentId),
    {
      enabled: !!selectedCommentId,
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

  const { mutate: deleteMutate } = useMutation(['deleteComment'], deleteComment);
  const { mutate } = useMutation(['userComment'], userComment, {
    onSuccess: () => {
      setSelectedImage(null);
      setIsSubmitting(false);
      toast.success("Comment posted successfully!");
    },
    onError: (err) => {
      console.log(err);
      setIsSubmitting(false);
      toast.error("Failed to post comment");
    }
  });

  const { mutate: mutateReply } = useMutation(['userReplyComment'], userReplyComment, {
    onSuccess: () => {
      setReplyTo(null);
      setSelectedCommentId(null);
      setIsSubmitting(false);
      toast.success("Reply posted successfully!");
    },
    onError: (err) => {
      console.log(err);
      setIsSubmitting(false);
      toast.error("Failed to post reply");
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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
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

  const onSubmit: SubmitHandler<IAddComment> = (formData) => {
    setIsSubmitting(true);
    const currentTime = format(new Date(), 'HH:mm a');
    const temporaryId = Date.now();
    const comment = formData.comment;

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

    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }

    if (!formData.comment && !selectedImage) {
      toast.error("Please provide either a comment or an image");
      setIsSubmitting(false);
      return;
    }

    setProductComment((prevComments) => [...prevComments, newComment]);

    if (replyTo) {
      formDataToSend.append("replyTo", replyTo);
      mutateReply({ id: selectedCommentId, comment });
    } else {
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
    if (!isSubmitting) {
      handleSubmit(onSubmit)();
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  const loggedInUserId = userData?._id;

  const { mutate: likeCommentMutate } = useMutation(['userLikeAComment'], userLikeAComment, {});

  const handleCommentLike = async (commentId: string) => {
    if (isUserAuthenticated) {
      const updatedComments = [...productComment];
      const commentIndex = updatedComments.findIndex((comment) => comment?._id === commentId);

      if (commentIndex !== -1) {
        const comment = updatedComments[commentIndex];
        const isLiked = loggedInUserId ? comment.user_likes?.includes(loggedInUserId) : false;

        if (!isLiked) {
          comment.total_likes = (comment?.total_likes || 0) + 1;
          if (loggedInUserId) {
            comment.user_likes = [...(comment?.user_likes || []), loggedInUserId];
          }
        } else {
          comment.total_likes = (comment?.total_likes || 0) - 1;
          comment.user_likes = (comment?.user_likes || []).filter((userId: string) => userId !== loggedInUserId);
        }

        setProductComment(updatedComments);
        likeCommentMutate(commentId);
      }
    } else {
      toast.error("Please login to like this comment");
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
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutate(id);
      setProductComment((prevComments) => prevComments.filter(comment => comment._id !== id));
      toast.success("Comment deleted successfully");
    }
  };

  const handleReplyClick = (commentId: string, userName: string) => {
    setReplyTo(userName);
    setSelectedCommentId(commentId);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setSelectedCommentId(null);
  };

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'MMM dd, yyyy HH:mm');
    } catch {
      return timeString;
    }
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500',
      'bg-yellow-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${location.pathname === '/quicks' ? 'hidden' : ''}`}
            >
              <IoMdArrowBack className="text-xl text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Comments ({productComment?.length || 0})
            </h1>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from(new Array(5)).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Skeleton variant="circular" width={40} height={40} className="dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <Skeleton width="30%" height={20} className="dark:bg-gray-700" />
                    <Skeleton width="80%" height={16} className="dark:bg-gray-700" />
                    <Skeleton width="60%" height={16} className="dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : productComment.length !== 0 ? (
          <div className="space-y-4">
            {productComment
              .filter((comment) => comment !== null && comment?.comment !== '' && comment?.user !== null)
              .map((comment: IAddComment) => (
                <div key={comment?._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getRandomColor(comment?.user?.fullName || 'User')}`}>
                        {comment?.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                            {comment?.user?.fullName}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(comment?.createdTime)}
                          </span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                          {comment?.comment}
                        </p>

                        {comment?.image && (
                          <div className="mb-3">
                            <img
                              src={comment?.image}
                              alt="Comment attachment"
                              className="rounded-lg max-w-xs h-auto cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleImageClick(comment?.image)}
                            />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-2">
                          <button
                            onClick={() => handleCommentLike(comment?._id)}
                            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                          >
                            {loggedInUserId && comment?.user_likes?.includes(loggedInUserId) ? (
                              <IoHeart className="text-red-500" />
                            ) : (
                              <IoHeartOutline />
                            )}
                            <span>{comment?.total_likes || 0}</span>
                          </button>

                          <button
                            onClick={() => handleReplyClick(comment?._id, comment?.user?.fullName || '')}
                            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <MdReply />
                            <span>Reply</span>
                          </button>

                          {comment.user?._id === loggedInUserId && (
                            <button
                              onClick={() => handleDeleteComment(comment?._id)}
                              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors ml-auto"
                            >
                              <MdDeleteOutline />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <IoImageOutline className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Be the first to share your thoughts about this product!</p>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {imagePreviewUrl && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="relative inline-block">
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border-2 border-blue-500"
              />
              <button
                onClick={handleCancelImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <IoMdClose className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Indicator */}
      {replyTo && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Replying to <strong>{replyTo}</strong>
              </span>
              <button
                onClick={cancelReply}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Input */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={handlePlusIconClick}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Add image"
            >
              <IoAdd className="text-xl" />
            </button>

            <div className="flex-1 relative">
              <textarea
                {...register('comment')}
                placeholder={replyTo ? `Replying to ${replyTo}...` : "Write a comment..."}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows={1}
                style={{
                  minHeight: '44px',
                  maxHeight: '120px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              {errors.comment && (
                <p className="absolute -bottom-6 left-0 text-xs text-red-500">
                  {errors.comment.message}
                </p>
              )}
            </div>

            <button
              onClick={handleComment}
              disabled={isSubmitting || (!commentText?.trim() && !selectedImage)}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px]"
              title="Send comment"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoMdSend className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && modalImageUrl && (
        <ImageModal imageUrl={modalImageUrl} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Comment;