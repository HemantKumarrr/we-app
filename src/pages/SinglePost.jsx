import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageSquareQuote,
  CornerRightDownIcon,
  Bookmark,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../store/features/post.slice";
import toast from "react-hot-toast";
import CommentBox from "../components/CommentBox";
import { UserRound } from "lucide-react";
import { setSavedPosts } from "../store/features/post.slice";
import AudioUI from "../components/AudioUI";
import { canDeletePost } from "../utils/permissions";
import ConfirmModal from "../components/modals/ConfirmModal";

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const isPostSaved = useSelector((state) => state.posts.savedPosts);
  const [postData, setPostData] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const commentsOnPost = JSON.parse(localStorage.getItem("comments"))?.length;
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?.user._id;
  const dispatch = useDispatch();

  const savePost = async () => {
    if (!currentUser) return navigate("/login");
    try {
      const response = await api.post(
        "/saved-posts",
        { userId, postId },
        { withCredentials: true }
      );
      console.log(response.data);
      toast.success(response.data.message);
      dispatch(setSavedPosts(postId));
    } catch (error) {
      console.log(error);
    }
  };

  const postSavedBoo = isPostSaved.includes(postId);

  const handleDeletePost = async () => {
    if (!userId) {
      return navigate("/login");
    }
    try {
      const response = await api.delete(`/delete-post/${postId}`, {
        withCredentials: true,
      });
      dispatch(deletePost(postId));
      toast.success("Post Deleted");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLike = async () => {
    if (!userId) return navigate("/login");
    const response = await api.post(
      `/posts/${postId}/toggle-like`,
      { userId },
      {
        withCredentials: true,
      }
    );
    setPostData(response.data.post);
  };

  const fetchPost = useCallback(async () => {
    try {
      const response = await api.get(`/get-post/${postId}`, {
        withCredentials: true,
      });
      setPostData(response.data.data[0]);
    } catch (err) {
      console.log(err);
      toast.success(err.error);
    }
  }, [dispatch]);

  const PostLike = () => {
    return (
      <>
        <Heart
          size={16}
          className={`transition-all
            ${
              postData?.likes.includes(userId)
                ? "fill-red-600 text-red-600"
                : "fill-none"
            }`}
        />
      </>
    );
  };

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [dispatch]);

  return (
    <div className="py-4">
      {/* <ConfirmModal /> */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title=""
      >
        <div className="w-full ">
          <img
            src={postData?.imageUrl}
            className="max-h-[28rem] mx-auto"
            alt="post-image"
          />
        </div>
      </ConfirmModal>
      <div className="single-post flex flex-col items-start justify-center gap-2">
        <div className="hover:bg-gray-900 rounded-full cursor-pointer active:bg-zinc-800">
          <ArrowLeft onClick={() => window.history.back()} />
        </div>
        <div className="ask border w-full border-gray-400 rounded-sm px-2 md:px-4 py-4">
          <div className="">
            <h1 className="text-2xl font-semibold w-full bg-gray-800 rounded-sm px-4">
              # {postData?.title || "loading.."}
            </h1>
            <div className="assets py-2 w-full flex items-center justify-center">
              {postData?.imageUrl && (
                <img
                  onClick={() => setModalOpen(true)}
                  className="w-50 h-50 object-contain cursor-pointer object-center"
                  src={postData?.imageUrl}
                  alt="assest-image"
                  loading="lazy"
                />
              )}
              {postData?.audioUrl && (
                <div className="w-full items-center justify-center px-8 py-2">
                  <AudioUI name="Audio File" audioUrl={postData?.audioUrl} />
                </div>
              )}
            </div>
            <div className="px-1 py-4 md:p-4">
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(postData?.detail),
                }}
              />
              {!postData && <p>Loading...</p>}
            </div>
          </div>
          <div className="btn flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 cursor-pointer hover:bg-zinc-800 p-1 rounded-full active:scale-[0.90]"
              >
                <PostLike />
                <p>{postData?.likes.length || 0}</p>
              </button>
              <button className="cursor-pointer flex items-center gap-1 hover:bg-zinc-800 p-1 rounded-full active:scale-[0.90]">
                <MessageSquareQuote size={18} />
                <p>{commentsOnPost}</p>
              </button>
              <div className="author text-sm flex items-center gap-1">
                <UserRound size={24} className="bg-zinc-800 p-1 rounded-full" />
                {postData?.user.username || "loading..."}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canDeletePost(currentUser?.user, postData?.user._id) && (
                <button
                  onClick={handleDeletePost}
                  className="cursor-pointer hover:bg-zinc-800 p-1 rounded-full active:scale-[0.90]"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={savePost}
                className="cursor-pointer hover:bg-zinc-800 p-1 rounded-full active:scale-[0.90]"
              >
                <Bookmark size={18} fill={postSavedBoo ? "white" : "black"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <h1 className="font-mono font-semibold flex items-center pt-8 gap-2 text-xl text-gray-300">
        Replies <CornerRightDownIcon size={20} strokeWidth={3} />
      </h1>
      <div className="comments md:pl-30 md:pr-4 py-2 flex flex-col gap-8">
        <CommentBox postId={postId} />
      </div>
    </div>
  );
};

export default SinglePost;
