import toast from "react-hot-toast";
import { api } from "../api/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostCardLoader from "../components/PostCardLoader";
import { SquarePenIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { logOut } from "../store/features/auth.slice";
import { Helmet } from "react-helmet";

const MyQuestions = () => {
  const { uid } = useParams();
  const [myPosts, setMyPosts] = useState();
  const [IsLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/get-posts/${uid}`, {
        withCredentials: true,
      });
      if (response.data.error) {
        setIsLoading(false);
        if (response.data.error === "authorized token not found") {
          dispatch(logOut());
          return navigate("/login");
        }
        return toast.error(response.data.error);
      }
      console.log(response);
      setMyPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMyPosts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-10">
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Questions - We.</title>
        <link rel={`https://mysite.com/my-questions`} />
        <meta
          name="description"
          content="list of all your questions on we platform"
        />
      </Helmet>
      <div className=" flex items-center">
        <h1 className="text-xl font-semibold px-4 rounded-full border border-gray-700 py-1 text-white">
          My Posts
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
            {myPosts?.map((item) => {
              return (
                <PostCard
                  key={item._id}
                  user={item.user}
                  title={item.title}
                  detail={item.detail}
                  createdAt={item.createdAt}
                  postId={item._id}
                  likes={item.likes}
                />
              );
            })}
          </>
        )}
      </ul>
      {myPosts?.length === 0 && (
        <div>
          <div className="flex flex-col py-20 gap-6 items-center justify-center">
            <h1 className="text-5xl font-semibold text-gray-700">
              No posts yet!
            </h1>
            <button
              onClick={() => navigate("/create")}
              className="flex items-center gap-2 text-white bg-blue-600 transition-all hover:scale-[1.030] duration-100 ease-in-out cursor-pointer hover:shadow-lg rounded-md px-4 py-1 font-semibold"
            >
              Create now
              <SquarePenIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuestions;
