import { useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { FaTwitter } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebook } from "react-icons/fa6";
import toast from "react-hot-toast";

const ShareDropdown = ({ postUrl }) => {
  const [open, setOpen] = useState(false);
  const encodedUrl = encodeURIComponent(postUrl);
  const text = encodeURIComponent("Check out this post! on We platform");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
    setOpen(false);
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post! on We platform",
          url: postUrl,
        })
        .catch(console.error);
    } else {
      toast.error("Web Share not supported on this device.");
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center cursor-pointer hover:bg-zinc-800 p-1 rounded-full active:scale-[0.90]"
      >
        <GoShareAndroid size={18} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-10 mt-2 right-0 w-30 bg-primary border border-gray-600 rounded shadow-lg p-2 space-y-2">
          <button
            onClick={handleCopy}
            className="w-full cursor-pointer text-xs text-left px-3 py-2 hover:bg-gray-800 rounded"
          >
            📋 Copy Link
          </button>
          <a
            href={`https://wa.me/?text=${text}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-start gap-2 text-xs px-3 py-2 hover:bg-gray-800 rounded"
          >
            <IoLogoWhatsapp size={16} className="text-green-500" />
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-start gap-2 text-xs px-3 py-2 hover:bg-gray-800 rounded"
          >
            <FaTwitter size={16} className="text-blue-600" /> Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-start gap-2 text-xs px-3 py-2 hover:bg-gray-800 rounded"
          >
            <FaFacebook size={16} className="text-blue-500" />
            <p>Facebook</p>
          </a>
          <button
            onClick={handleWebShare}
            className="w-full flex items-center justify-center gap-2 cursor-pointer text-xs text-left px-3 py-2 hover:bg-gray-800 rounded"
          >
            📱 <p className="">Other Device</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;
