import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";
import AudioUI from "./AudioUI";

const AttachFile = ({ postData, setPostData }) => {
  const [fileBtnToggle, setFileBtnToggle] = useState(false);
  const [imageToggle, setImageToggle] = useState(false);
  const [audioToggle, setAudioToggle] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setFileBtnToggle((prev) => !prev)}
        type="button"
        className="text-sm bg-zinc-800 px-3 py-1 rounded-sm cursor-pointer active:scale-[0.94]"
      >
        Upload
      </button>
      <button
        type="button"
        onClick={() => {
          setPreviewFile(null);
          setPostData({ ...postData, imageUrl: null, audioUrl: null });
        }}
        className="text-xs underline text-blue-500 ml-2 cursor-pointer"
      >
        reset
      </button>
      <div
        className={`${
          fileBtnToggle ? "flex" : "hidden"
        } bg-zinc-900 absolute z-[50] px-2 top-0 left-18 rounded-sm py-2 flex-col items-center justify-center gap-2`}
      >
        <div className="image text-center">
          <label
            htmlFor="image-file-upload"
            onClick={() => {
              setFileBtnToggle(false);
              setImageToggle(true);
              setPostData({ ...postData, imageUrl: null });
            }}
            className="text-sm hover:bg-zinc-800 px-3 py-1 rounded-sm cursor-pointer active:scale-[0.86]"
          >
            Image
          </label>
          <input
            onChange={(e) => {
              const myfile = e.target.files[0];
              if (myfile && myfile.type.startsWith("image")) {
                const imageUrl = URL.createObjectURL(myfile);
                setPreviewFile(imageUrl);
                setPostData({
                  ...postData,
                  imageUrl: myfile,
                  audioUrl: null,
                });
              } else {
                toast.error("Please select a valid image file.");
              }
            }}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif"
            id="image-file-upload"
            className="hidden"
          />
        </div>
        <div className="audio text-center">
          <label
            onClick={() => {
              setFileBtnToggle(false);
              setAudioToggle(true);
              setPostData({ ...postData, imageUrl: null });
            }}
            htmlFor="audio-file-upload"
            className="text-sm hover:bg-zinc-800 px-3 py-1 rounded-sm cursor-pointer active:scale-[0.86]"
          >
            Audio
          </label>
          <input
            onChange={(e) => {
              const myfile = e.target.files[0];
              if (myfile && myfile.type.startsWith("audio")) {
                const audioUrl = URL.createObjectURL(myfile);
                setPreviewFile(audioUrl);
                setPostData({
                  ...postData,
                  imageUrl: null,
                  audioUrl: myfile,
                });
              } else {
                toast.error("Please select a valid audio file.");
              }
            }}
            type="file"
            accept=".mp3,.wav,.ogg"
            id="audio-file-upload"
            className="hidden"
          />
        </div>
      </div>
      {previewFile && (
        <div className="w-full relative mt-2 py-1 px-8 border border-blue-900 bg-blue-500/4">
          <>
            {postData.imageUrl && (
              <>
                <button
                  onClick={() => {
                    setPostData({ ...postData, imageUrl: null });
                    setPreviewFile(null);
                    setImageToggle(false);
                  }}
                  type="button"
                  className="absolute -top-2 -right-2 cursor-pointer"
                >
                  <IoMdCloseCircle size={28} />
                </button>
                {imageToggle && (
                  <img
                    className="w-28 h-28 object-contain object-center"
                    src={previewFile}
                    alt="image"
                  />
                )}
              </>
            )}
            {postData.audioUrl && (
              <>
                <div className="relative py-4 w-full">
                  <button
                    onClick={() => {
                      setPostData({ ...postData, audioUrl: null });
                      setPreviewFile(null);
                      setAudioToggle(false);
                    }}
                    type="button"
                    className="absolute  bottom-2 -right-6 cursor-pointer"
                  >
                    <IoMdCloseCircle size={28} />
                  </button>

                  <AudioUI
                    name={postData.audioUrl.name}
                    file={postData.audioUrl}
                  />
                </div>
              </>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default AttachFile;
