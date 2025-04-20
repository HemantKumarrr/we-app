import { Reply, Trash2Icon, User2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { deleteComment } from "../store/features/post.slice";
import DOMPurify from "dompurify";
import { canDeleteComment } from "../utils/permissions";

const CommentCard = ({ commentId, user, createdAt, desc }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const timeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
    }).replace("about ", "");
  };

  const handleDeleteComment = async () => {
    try {
      const response = await api.delete(`/delete-comment/${commentId}`, {
        withCredentials: true,
      });
      console.log(response);
      toast.success("comment deleted");
      dispatch(deleteComment(commentId));
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteBtn = () => {
    return (
      <>
        {canDeleteComment(currentUser?.user, user?._id) && (
          <button onClick={handleDeleteComment}>
            <Trash2Icon
              size={24}
              className="cursor-pointer active:scale-[0.916] text-red-600 bg-gray-200 p-1 rounded-full"
            />
          </button>
        )}
      </>
    );
  };

  return (
    <div className="border flex flex-col items-start px-1 py-2 border-gray-500 rounded-sm">
      <div className="w-full flex px-4">
        <div className="flex items-center w-full gap-2">
          <User2Icon size={18} />
          <div className="">
            <p className="text-[12px] font-semibold">{user?.username}</p>
            <p className="text-gray-500 text-[10px]">{timeAgo(createdAt)}</p>
          </div>
        </div>
        <Reply />
      </div>
      <div className="flex items-center justify-between w-full px-4 py-1">
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(DOMPurify.sanitize(desc)),
          }}
        />
        <DeleteBtn />
      </div>
    </div>
  );
};

export default CommentCard;
