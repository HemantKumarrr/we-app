import { useEffect, useState } from "react";
import { api } from "../api/api";
import CommentCard from "./CommentCard";
import { useDispatch, useSelector } from "react-redux";
import { setAllComments, setReply } from "../store/features/post.slice";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import PostCardLoader from "./PostCardLoader";
import { useNavigate } from "react-router-dom";

const CommentBox = ({ postId }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const allComments = useSelector((state) => state.posts.comments);
  const userId = currentUser?.user._id;
  const navigate = useNavigate();

  const [postReply, setPostReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/get-all-comment/${postId}`);
      dispatch(setAllComments(response.data.data));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handleReply = async () => {
    if (!currentUser) return navigate("/login");
    try {
      setIsLoading(true);
      const response = await api.post(
        `/post-comment/${postId}`,
        {
          userId: userId,
          desc: postReply,
        },
        { withCredentials: true }
      );
      toast.success("reply posted");
      setPostReply("");
      setIsLoading(false);
      dispatch(setReply(response.data.data));
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [dispatch, allComments?.length]);

  return (
    <div className="flex flex-col gap-8">
      <div className="py-4 md:pl-20 flex flex-col items-start justify-center gap-2">
        <div className="border w-full text-xl rounded-sm border-gray-400">
          <ReactQuill
            theme="snow"
            value={postReply}
            onChange={(value) => setPostReply(value)}
            className="ql-container-reply"
          />
        </div>
        <button
          onClick={handleReply}
          className="bg-blue-600 cursor-pointer text-sm py-1 hover:bg-blue-500 text-white px-6 active:scale-[0.96] rounded-sm"
        >
          Reply
        </button>
      </div>
      {isLoading && <PostCardLoader />}
      {!isLoading &&
        allComments?.map((item) => {
          return (
            <CommentCard
              key={item._id}
              commentId={item?._id}
              user={item?.user}
              createdAt={item?.createdAt}
              desc={item?.desc}
              postId={item?._id}
              likes={item?.likes}
            />
          );
        })}
    </div>
  );
};

export default CommentBox;
