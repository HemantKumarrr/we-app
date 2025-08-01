import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Heart, UserRound } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { setSavedPosts } from "../store/features/post.slice";

const PostCard = ({ user, title, detail, createdAt, postId, likes }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userId = currentUser?.user?._id;
  const isPostSaved = useSelector((state) => state.posts.savedPosts);
  const dispatch = useDispatch();

  const savePost = async () => {
    if (!currentUser) return navigate("/login");
    try {
      const response = await api.post(
        "/saved-posts",
        { userId, postId },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      dispatch(setSavedPosts(postId));
    } catch (error) {
      console.log(error);
    }
  };

  const htmlToText = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "NA";
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    // Format as date if more than a week ago
    return past.toLocaleDateString();
  };

  const IsLoading = () => {
    return <>Loading...</>;
  };

  return (
    <div className="card hover:scale-[1.015] transition-all duration-100 ease-linear px-8 border border-gray-700 hover:border hover:border-r-green-500 hover:border-b-orange-500 hover:border-t-blue-600 hover:border-l-blue-400 flex justify-between hover:shadow-md mb-4 py-4 rounded-sm">
      <Link to={`/post/${postId}`} className="w-full mr-4">
        <div className="flex w-full items-end">
          <h1 className="text-xl font-semibold w-full">
            # {title || <IsLoading />}
          </h1>
        </div>
        <p className="text-xs py-1 px-4 flex items-center gap-1 font-semibold">
          <UserRound size={12} />
          {user?.username || <IsLoading />}
        </p>
        <div className="">
          <p className="text-sm px-4 text-gray-400">
            {(htmlToText(detail).length > 80
              ? htmlToText(detail).slice(0, 80) + "..."
              : htmlToText(detail)) || <IsLoading />}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <p className="flex items-center gap-1">
            {likes?.includes(currentUser?.user?._id) ? (
              <FaHeart className="text-red-600 w-3" />
            ) : (
              <Heart size={12} />
            )}
            <span className="text-xs">{likes?.length}</span>
          </p>
          <p className="text-xs text-gray-400">Posted {timeAgo(createdAt)}</p>
        </div>
      </Link>
      <section className="flex items-end justify-center">
        <button
          onClick={savePost}
          className="cursor-pointer"
          aria-label="save post"
        >
          <Bookmark
            size={20}
            fill={isPostSaved.includes(postId) ? "white" : "black"}
          />
        </button>
      </section>
    </div>
  );
};

export default PostCard;
