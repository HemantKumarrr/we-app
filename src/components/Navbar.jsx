import { Menu, UserRound, X, PlusIcon, Flag } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/features/auth.slice";
import toast from "react-hot-toast";
import { api } from "../api/api";
import CreateButton from "./CreateButton";
import ConfirmModal from "../components/modals/ConfirmModal";

const Navbar = () => {
  const isAuth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [menuToggle, setMenuToggle] = useState(false);
  const [profileToggle, setProfileToggle] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const menuRef = useRef(null);
  const profileToggleRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.get("/logout", { withCredentials: true });
      dispatch(logOut());
      setProfileToggle(false);
      navigate("/login");
      toast.success("Logged Out");
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
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuToggle(false);
      }
      if (
        profileToggleRef.current &&
        !profileToggleRef.current.contains(event.target)
      ) {
        setMenuToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
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
      <div className="nav-container bg-primary z-50 fixed w-full h-14 border-b border-gray-800 flex items-center justify-between px-2 md:px-30 lg:px-40">
        <div className="logo">
          <Link className="font-bold gap-1 flex md:text-xl px-2 py-1" to="/">
            <svg
              className="w-4 md:w-5"
              height="25"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="headphoneLogo"
              role="img"
            >
              <title id="headphoneLogo">Headphone Logo</title>

              <path
                d="M40 130C40 75 90 30 150 30s110 45 110 100"
                stroke="white"
                strokeWidth="10"
                fill="none"
              />

              <rect x="30" y="130" width="40" height="50" rx="8" fill="white" />

              <rect
                x="130"
                y="130"
                width="40"
                height="50"
                rx="8"
                fill="white"
              />
            </svg>
            We.
          </Link>
        </div>

        {/* // Desktop View */}
        <div className="tabs desktop hidden md:block">
          {isAuth ? (
            <div className="After-Login-tabs">
              <ul className="flex text-sm items-center justify-center gap-2">
                <li>
                  <Link
                    className="px-2 flex text-white items-center gap-1 hover:bg-blue-500 bg-blue-600 transition-all ease-in-out duration-200 py-1 rounded-sm"
                    to={`/post/user/${isAuth?.user?._id}`}
                  >
                    <Flag size={18} />
                    My ques?
                  </Link>
                </li>
                <li>
                  <Link
                    className="px-2 flex items-center border border-gray-700 gap-1 transition-all ease-in-out duration-200 py-1 rounded-sm"
                    to={`/post/bookmarks`}
                  >
                    Bookmarks
                  </Link>
                </li>
                <li>
                  <Link
                    className="px-2 flex items-center gap-1 group hover:bg-gray-600 transition-all ease-in-out duration-100 py-1 rounded-full"
                    to="/create"
                  >
                    {/* <PlusIcon size={20} /> */}
                    <CreateButton />
                    <p className="font-semibold">Ask artists</p>
                  </Link>
                </li>
                <li>
                  <div className="profile bg-primary relative pl-2 inline-block group">
                    <UserRound />
                    {/* Dropdown Menu */}
                    <div className="absolute -left-12 mt-2 w-32 bg-primary border border-gray-600 rounded-sm shadow-lg opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-200">
                      <ul className="py-2 text-xs bg-primary">
                        <li className="px-4 py-2 hover:bg-secondary cursor-pointer">
                          <Link to="/myprofile">My Profile </Link>
                        </li>
                        {isAuth?.user?.role === "admin" && (
                          <li className="px-4 py-2 hover:bg-secondary cursor-pointer">
                            <Link to="/admin/dashboard">Dashboard </Link>
                          </li>
                        )}
                        <li className="hover:font-semibold transition-all ease-linear duration-150 hover:bg-secondary cursor-pointer">
                          <button
                            onClick={() => setModalOpen((prev) => !prev)}
                            className="px-4 py-2 cursor-pointer"
                          >
                            Account delete
                          </button>
                        </li>
                        <li className="transition-all ease-linear duration-150 hover:bg-red-500">
                          <button
                            className="px-4 py-2 cursor-pointer w-full text-start"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            <div className="before-Login-tabs flex justify-center items-center gap-6">
              <ul className="flex justify-center items-center gap-4 text-[0.8rem]">
                <li>
                  <Link
                    className="px-2 flex items-center gap-1 group hover:bg-gray-600 transition-all ease-in-out duration-100 py-1 rounded-full"
                    to="/create"
                  >
                    {/* <PlusIcon size={20} /> */}
                    <CreateButton />
                    <p className="font-semibold">Ask artists</p>
                  </Link>
                </li>
              </ul>
              <div className="auth-btn text-sm flex justify-center items-center gap-2 font-semibold">
                <Link
                  className="px-2 bg-zinc-900 hover:text-black border border-gray-500 rounded-sm py-[0.20rem] hover:bg-white"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="px-2 border border-gray-600 bg-blue-600 hover:bg-blue-500 text-white rounded-sm py-[0.20rem]"
                  to="/signup"
                >
                  Signup
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* //Mobile View */}
        <div className="mobile-menu md:hidden flex items-center justify-center gap-4">
          {!isAuth && (
            <div
              ref={menuRef}
              onClick={() => {
                setMenuToggle((prev) => !prev);
              }}
              className="auth text-sm flex justify-center w-full items-center gap-2"
            >
              <Link
                title="create"
                className="px-2 flex gap-0 whitespace-nowrap md:flex-row items-center md:gap-1 hover:bg-gray-800 md:hover:bg-gray-100 transition-all ease-in-out duration-200 py-1 rounded-full"
                to="/create"
              >
                <PlusIcon size={20} />
                {/* <p className="font-semibold">Ask artists</p> */}
              </Link>

              <Link
                className="px-2 border text-xs rounded-sm py-[0.25rem]"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="px-2 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-sm py-[0.25rem]"
                to="/signup"
              >
                Signup
              </Link>
            </div>
          )}

          {isAuth && (
            <div className="profile relative pl-10 md:pl-2 inline-block group">
              <UserRound
                className="cursor-pointer"
                onClick={() => setProfileToggle((prev) => !prev)}
              />
              {/* Dropdown Menu */}
              {profileToggle && (
                <div className="absolute -left-15 mt-2 w-32 bg-primary border border-gray-700 rounded-sm shadow-lg transition-all duration-200">
                  <ul className="py-2 text-xs">
                    <Link to="/myprofile">
                      <li
                        onClick={() => setProfileToggle(false)}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      >
                        My Profile
                      </li>
                    </Link>
                    {isAuth?.user?.role === "admin" && (
                      <li className="px-4 py-2 hover:bg-secondary cursor-pointer">
                        <Link to="/admin/dashboard">Dashboard </Link>
                      </li>
                    )}
                    <li className="hover:font-semibold transition-all ease-linear duration-150 hover:bg-gray-700 cursor-pointer">
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 cursor-pointer"
                      >
                        Account delete
                      </button>
                    </li>
                    <li className="cursor-pointer hover:text-white transition-all ease-linear duration-150 hover:bg-red-600">
                      <button
                        onClick={handleLogout}
                        className="cursor-pointer px-4 py-2"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {isAuth && (
            <button
              className="cursor-pointer"
              onClick={() => setMenuToggle((prev) => !prev)}
            >
              {menuToggle ? <X /> : <Menu />}
            </button>
          )}
          {isAuth && menuToggle && (
            <div className="toggle-menu fixed border-l border-gray-700 bg-primary shadow top-14 right-0 px-8 bottom-0 space-y-4 h-[calc(100vh - 56px)]">
              <ul
                onClick={() => {
                  setMenuToggle((prev) => !prev);
                }}
                className="flex flex-col text-sm py-8 items-center justify-center gap-8"
              >
                {isAuth && (
                  <>
                    <li className="w-full">
                      <Link
                        className="px-16 flex items-center hover:bg-gray-700 gap-1 border border-gray-800 transition-all ease-in-out duration-200 py-1 rounded-sm"
                        to="/create"
                      >
                        <CreateButton size="18" />
                        <p>Ask artists</p>
                      </Link>
                    </li>
                    <li className="w-full">
                      <Link
                        className="px-16 flex items-center hover:bg-gray-700 gap-1 border border-gray-800 transition-all ease-in-out duration-200 py-1 rounded-sm"
                        to={`/post/user/${isAuth.user._id}`}
                      >
                        <Flag size={18} />
                        My ques?
                      </Link>
                    </li>
                    <li className="w-full">
                      <Link
                        className="px-16 flex items-center hover:bg-gray-700 gap-1 border border-gray-800 transition-all ease-in-out duration-200 py-1 rounded-sm"
                        to="/post/bookmarks"
                      >
                        <Flag size={18} />
                        Bookmarks
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
