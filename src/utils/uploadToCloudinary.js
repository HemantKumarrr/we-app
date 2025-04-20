import axios from "axios";

const uploadToCloudinary = async (file, onProgress, folderName) => {
  const cloudName = import.meta.env.VITE_CLOUD_NAME; // replace with your Cloudinary cloud name
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET; // replace with your unsigned upload preset

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folderName);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) onProgress(percent);
      },
    });

    // Return the secure URL of the uploaded image
    return response.data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
export default uploadToCloudinary;
