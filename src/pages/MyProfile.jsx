import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { api } from "../api/api";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/features/auth.slice";
import ConfirmModal from "../components/modals/ConfirmModal";
import { MdDeleteForever } from "react-icons/md";
import { Helmet } from "react-helmet";

const MyProfile = () => {
  const isAuth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.auth.user.user);
  const [editUsername, setEditUsername] = useState(false);
  const [editAge, setEditAge] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [updatedUser, setUpdatedUser] = useState({
    username: currentUser.username,
    email: currentUser.email,
    age: currentUser.age || 0,
    country: currentUser.country || "Choose here...",
  });

  const isChange =
    updatedUser.username !== currentUser.username ||
    updatedUser.age !== currentUser.age ||
    updatedUser.country !== "Choose here...";

  const fetchCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const sortedCountries = response.data
        .map((country) => country.name.common)
        .sort((a, b) => a.localeCompare(b));

      setCountries(sortedCountries);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async () => {
    console.log(currentUser?._id);
    console.log(updatedUser);
    try {
      const response = await api.put(
        `/update-profile/${currentUser?._id}`,
        updatedUser,
        { withCredentials: true }
      );
      dispatch(setCredentials(response.data));
      toast.success("updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete(`/account-delete/${isAuth.user._id}`, {
        withCredentials: true,
      });
      toast.success("User account deleted");
      setProfileToggle(false);
      setModalOpen(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchCountries();
  }, []);

  return (
    <div className="pt-14 md:px-8 lg:px-18">
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Profile - We.</title>
        <link rel={`https://mysite.com/my-profile`} />
        <meta name="description" content="manage your profile on we platform" />
      </Helmet>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm to Delete account"
      >
        <div className="">
          <button
            onClick={() => handleDeleteAccount()}
            className="px-4 py-1 cursor-pointer text-sm bg-red-600 text-white"
          >
            Delete account
          </button>
        </div>
      </ConfirmModal>
      <div className="card border flex md:flex-row flex-col items-center justify-center p-2 md:p-4 rounded-sm border-gray-700">
        <div className="flex w-full flex-col justify-center items-center gap-4 py-4">
          <img
            className="image w-[5rem] h-[5rem] object-cover object-center rounded-full"
            src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671126.jpg?t=st=1744363592~exp=1744367192~hmac=bc733894230ff81940830f73adb3ccc9c9395a1f7bc871c96c4e1fcdbc56890f&w=826"
            alt="profile-image"
          />

          <h1 className="text-3xl font-bold text-center">
            Hola! {currentUser.username} 👋
          </h1>
        </div>
        <div className="flex flex-col w-full gap-5 px-1 md:px-4 items-start justify-center">
          <h1 className="text-xl font-semibold w-full text-gray-300">
            Your Info{" "}
          </h1>
          <div className="w-full border-gray-600 flex justify-between gap-4 px-6 py-2 border rounded-sm">
            <h1>Username </h1>
            {editUsername ? (
              <input
                autoFocus
                type="text"
                className="bg-bone w-full text-black rounded-sm outline-none px-2"
                value={updatedUser.username}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, username: e.target.value })
                }
              />
            ) : (
              <p className="w-full text-center">{updatedUser.username}</p>
            )}
            <div className="flex items-center justify-center">
              {editUsername ? (
                <button
                  onClick={() => setEditUsername((prev) => !prev)}
                  className="bg-green-600 px-2 flex items-center gap-2 cursor-pointer text-sm"
                >
                  save
                </button>
              ) : (
                <button
                  onClick={() => setEditUsername((prev) => !prev)}
                  className="text-white shadow-lg flex items-center gap-2 cursor-pointer rounded-sm text-sm"
                >
                  <FaEdit size={18} />
                </button>
              )}
            </div>
          </div>
          <div className="w-full border-gray-600 flex justify-between gap-4 px-6 py-2 border rounded-sm">
            <h1>Email</h1>
            <p className="w-full text-gray-400 text-center">
              {currentUser.email}
            </p>
          </div>
          <div className="w-full text-sm border-gray-600 flex md:flex-row flex-col justify-between gap-4 px-6 py-2 border rounded-sm">
            <div className="flex w-full gap-4 items-center justify-between">
              <h1 className="w-full">Age</h1>
              {editAge ? (
                <input
                  value={updatedUser.age}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, age: e.target.value })
                  }
                  autoFocus
                  type="number"
                  className="border no-spinner py-1 outline-none px-2 border-gray-500 rounded-md min-w-[2rem] w-full"
                />
              ) : (
                <p className="w-full text-center px-1 font-semibold">
                  {updatedUser.age}
                </p>
              )}
              <div className="flex w-full items-center justify-center">
                {editAge ? (
                  <button
                    onClick={() => setEditAge((prev) => !prev)}
                    className="bg-green-600  rounded-full flex items-center cursor-pointer text-sm"
                  >
                    <TiTick size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditAge((prev) => !prev)}
                    className="text-white shadow-lg flex items-center gap-2 cursor-pointer rounded-sm text-sm"
                  >
                    <FaEdit size={15} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex w-full gap-4 items-center justify-between ">
              <div className="flex gap-4 items-center justify-between w-full">
                <label htmlFor="country" className="text-sm">
                  Country:
                </label>

                {loading ? (
                  <p className="text-sm">Loading countries...</p>
                ) : (
                  <select
                    id="country"
                    value={updatedUser.country}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        country: e.target.value,
                      })
                    }
                    className="p-1 outline-none bg-primary border border-gray-700 rounded w-[12rem]"
                  >
                    <option value="">{updatedUser.country}</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            {isChange && (
              <button
                onClick={handleUpdateInfo}
                className="cursor-pointer bg-blue-600 active:scale-[0.94] px-2 py-1 text-sm rounded-xs"
              >
                Update
              </button>
            )}
            <button
              onClick={() => setModalOpen((prev) => !prev)}
              className="px-2 py-1 text-sm cursor-pointer bg-gray-800 flex items-center gap-2"
            >
              Delete Account
              <MdDeleteForever size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
