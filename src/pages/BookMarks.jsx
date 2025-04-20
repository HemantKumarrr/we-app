import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";
import PostCardLoader from "../components/PostCardLoader";

const BookMarks = () => {
  const currentUser = useSelector((state) => state.auth.user.user);
  const [savedPosts, setSavedPosts] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);

  const fetchSavedPosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/saved-posts/${currentUser._id}`, {
        withCredentials: true,
      });
      setSavedPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <div className="pt-10">
        <div className=" flex items-center">
          <h1 className="text-xl font-semibold px-4 rounded-full py-1 text-white border border-gray-700">
            My Bookmarks
          </h1>
          <img
            className="w-20"
            src="/images/gummy-printer.svg"
            alt="printer-image"
          />
        </div>
        <ul className="py-2">
          {IsLoading ? (
            <PostCardLoader />
          ) : (
            <>
              {savedPosts?.map((item) => {
                return (
                  <PostCard
                    key={item.post._id}
                    user={item.post.user}
                    title={item.post.title}
                    detail={item.post.detail}
                    createdAt={item.post.createdAt}
                    postId={item.post._id}
                    likes={item.post.likes}
                  />
                );
              })}
            </>
          )}
        </ul>
        {!savedPosts === 0 && (
          <div>
            <div className="flex flex-col py-20 gap-6 items-center justify-center">
              <h1 className="text-5xl font-semibold text-gray-700">
                its Empty!
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookMarks;
