import { useDispatch, useSelector } from "react-redux";
import { Telescope, SearchIcon } from "lucide-react";
import { useState, lazy, Suspense, useEffect } from "react";
import { RiSearchLine } from "react-icons/ri";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { allPostsData } from "../store/features/post.slice";
import toast from "react-hot-toast";
import { api } from "../api/api";

const Home = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  const postData = useSelector((state) => state.posts.posts);

  const AllPosts = postData?.filter((item) => {
    if (searchText === "") return item;
    return item.title.toLowerCase().includes(searchText.toLowerCase());
  });

  const fetchAllPosts = async () => {
    try {
      const response = await api.get("/get-posts");
      dispatch(allPostsData(response.data.data));
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div>
      <div className="pt-[12vh] md:pt-[16vh] relative ">
        <motion.h1
          initial={{ x: 18, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-6xl md:text-8xl relative bg-gradient-to-r bg-[linear-gradient(to_right,theme(colors.orange.400),theme(colors.purple.800),theme(colors.pink.800),theme(colors.green.500),theme(colors.blue.400),theme(colors.blue.800))] font-bold text-center bg-clip-text text-transparent animate-gradient"
        >
          WE ARTISTS.
        </motion.h1>
        <ul className="py-4 flex items-center justify-center gap-2 font-semibold text-gray-400">
          <li className="border text-[9px] md:text-xs md:text-md cursor-context-menu md:py-1 px-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
            Muscians
          </li>
          <li className="border text-[9px] md:text-xs md:text-md cursor-context-menu md:py-1 px-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
            Producers
          </li>
          <li className="border whitespace-nowrap text-[9px] md:text-xs md:text-md cursor-context-menu md:py-1 px-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
            Song writers
          </li>
          <li className="border text-[9px] md:text-xs md:text-md cursor-context-menu md:py-1 px-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 ease-in-out">
            Composers
          </li>
        </ul>
        {/* <div className="px-8 py-3 flex items-center justify-center gap-5">
          <img
            src="https://www.image-line.com/static/assets/nav-logo-fruit.41db863.png"
            alt="fl-stuio-logo"
            className="w-5"
          />
          <img
            src="https://cdn-resources.ableton.com/80bA26cPQ1hEJDFjpUKntxfqdmG3ZykO/static/images/ableton-hallmark.ef5355379032.svg"
            alt="ableton-logo"
            className="w-9"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/en/c/c7/Logic_Pro_icon.png"
            alt="ableton-logo"
            className="w-9"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/en/f/f7/GarageBand_App.png"
            alt="ableton-logo"
            className="w-9"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Cubase_logo.svg"
            alt="ableton-logo"
            className="w-16"
          />
        </div> */}
      </div>
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1,
          ease: [0.175, 0.885, 0.5, 1.5],
          delay: 0.5,
        }}
        className="search-box w-full bg-primary sticky top-[3.5rem] z-[20] flex items-center justify-center py-4"
      >
        <div className="flex justify-center w-full z-1 py-2 items-center">
          <div className="border-2 w-full md:w-fit flex pr-4 items-center justify-center border-r-green-500 rounded-full border-b-orange-600 border-t-blue-500 border-l-blue-600">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full md:w-[25rem] outline-none px-4 py-[0.3rem]"
              type="text"
              placeholder="find related posts"
            />
            <RiSearchLine className="text-2xl animate-bounce" />
          </div>
        </div>
        <div className="flex z-0 pl-6 absolute w-full md:w-[28rem] pr-3 py-5 items-center border border-r-green-500 rounded-full border-b-orange-800 border-t-blue-600 border-l-blue-800"></div>
      </motion.div>
      <div className="flex z-[21] items-start sticky top-30 w-full md:top-16">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-xl bg-primary w-full md:w-fit font-bold py-3 flex gap-2 items-center sticky top-[25rem]"
        >
          Explore! ({postData?.length || 0}) <Telescope />{" "}
        </motion.h1>
      </div>
      <ul className="postLists rounded-t-2xl px-0 md:px-10 lg:px-20 py-4">
        {AllPosts?.map((item) => {
          return (
            <li key={item._id}>
              <PostCard
                user={item.user}
                title={item.title}
                detail={item.detail}
                createdAt={item?.createdAt}
                postId={item._id}
                likes={item.likes}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
