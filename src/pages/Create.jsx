import { useDispatch } from "react-redux";
import { addPost } from "../store/features/post.slice";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import AttachFile from "../components/AttachFile";
import uploadToCloudinary from "../utils/uploadToCloudinary";

const Create = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    detail: "",
    imageUrl: null,
    audioUrl: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uid = JSON.parse(localStorage.getItem("user")).user._id;

  const handlePublishPost = async (e) => {
    e.preventDefault();
    setProgress(0);
    try {
      if (postData.imageUrl) {
        setIsLoading(true);
        const uploadedUrl = await uploadToCloudinary(
          postData.imageUrl,
          setProgress,
          "postImages"
        );
        postData.imageUrl = uploadedUrl;
        setIsLoading(false);
      }
      if (postData.audioUrl) {
        setIsLoading(true);
        const uploadedUrl = await uploadToCloudinary(
          postData.audioUrl,
          setProgress,
          "postAudios"
        );
        postData.audioUrl = uploadedUrl;
        setIsLoading(false);
      }
      setIsLoading(true);
      const response = await api.post(`/create/${uid}`, postData, {
        withCredentials: true,
      });
      console.log("Create Post Response: ", response);
      dispatch(addPost(response.data));
      setIsLoading(false);
      toast.success("Published successfully");
      navigate("/");
      console.log(postData);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div>
      <div className="container flex flex-col items-center pt-8 pb-12">
        <div className="flex items-center md:flex-row flex-col">
          <h1 className="font-semibold text-2xl md:text-3xl md:py-2 whitespace-nowrap">
            # Ask a question
          </h1>
          <div className="">
            <img
              className="w-20 bg-clip-content"
              src="/images/gummy-coffee.svg"
              alt="coffe-image"
            />
          </div>
        </div>
        <form
          onSubmit={handlePublishPost}
          className="flex flex-col w-full px-2 md:px-24 lg:px-30 gap-4 justify-center"
        >
          <label htmlFor="title" className="font-semibold">
            Title
            <p className="text-xs font-normal text-gray-500">
              Be specific and imagine you’re asking a question to another
              artist/musician.
            </p>
          </label>
          <input
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
            type="text"
            id="title"
            placeholder="eg. Is music theory necessary to make music?"
            className="border border-gray-400 outline-none hover:bg-elevated px-4 py-2 rounded-sm"
          />

          {/* File Upload */}

          <div className="attach-Files w-full flex items-center justify-start">
            {isLoading ? (
              <>
                {progress > 0 && progress < 100 && (
                  <div className="mt-2 w-full bg-bone rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full transition-all bg-gradient-to-r bg-[linear-gradient(to_right,theme(colors.orange.400),theme(colors.purple.800),theme(colors.pink.800),theme(colors.green.500),theme(colors.blue.400),theme(colors.blue.800))] animate-gradient"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </>
            ) : (
              <AttachFile postData={postData} setPostData={setPostData} />
            )}
          </div>

          <label htmlFor="more" className="font-semibold">
            Detail
          </label>
          <div className="border rounded-sm border-gray-400">
            <ReactQuill
              theme="snow"
              value={postData.detail}
              onChange={(value) => setPostData({ ...postData, detail: value })}
              className="ql-container"
            />
          </div>

          {isLoading ? (
            <div className="text-2xl flex items-center justify-center py-2 mt-4 bg-blue-400 cursor-not-allowed text-white rounded-md">
              <div className="w-6 h-6 border-3 border-gray-200 border-t-0 border-l-0 animate-spin rounded-full"></div>
            </div>
          ) : (
            <button
              onClick={handlePublishPost}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
            >
              Publish
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Create;
