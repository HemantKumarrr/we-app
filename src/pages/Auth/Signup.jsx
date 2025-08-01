import { EyeOff, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../api/api";
import { Helmet } from "react-helmet";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      userData.email === "" ||
      userData.password === "" ||
      userData.username === ""
    )
      return toast.error("fill all the fields");
    try {
      setIsLoading(true);
      const response = await api.post("/signup", userData);
      setIsLoading(false);
      toast.success(response.data.message);
      navigate(`/signup/otp/${userData.email}`);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error(err.response.data.error);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="w-full pt-20 ">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Signup - We.</title>
        <link rel={`https://mysite.com/signup`} />
        <meta name="description" content="create account on We platform" />
      </Helmet>
      <div className="card flex flex-col items-center justify-center h-full">
        <h1 className="md:text-4xl text-2xl font-bold uppercase text-gray-400">
          Signup
        </h1>
        <form className="flex flex-col md:w-[550px] gap-4 p-4 rounded-xs">
          <label htmlFor="email" className="md:text-xl">
            Username
          </label>
          <input
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            autoFocus
            required
            className="rounded-md outline-none px-4 py-2 bg-gray-800"
            type="text"
            placeholder="your username"
          />
          <label htmlFor="email" className="md:text-xl">
            E-mail
          </label>
          <input
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            required
            className="rounded-md outline-none px-4 py-2 bg-gray-800"
            type="text"
            placeholder="example@mail.com"
          />
          <label htmlFor="password" className="md:text-xl">
            Password
          </label>
          <div className="rounded-md flex items-center justify-between bg-gray-800">
            <input
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              required
              className="rounded-md outline-none px-4 py-2 w-full "
              type={showPass ? "text" : "password"}
              placeholder="enter password"
            />
            {showPass ? (
              <EyeIcon
                onClick={() => setShowPass((prev) => !prev)}
                className="mr-4 cursor-pointer"
              />
            ) : (
              <EyeOff
                onClick={() => setShowPass((prev) => !prev)}
                className="mr-4 cursor-pointer"
              />
            )}
          </div>
          {isLoading ? (
            <div className="text-2xl flex items-center justify-center py-2 mt-4 bg-blue-400 cursor-not-allowed text-white rounded-md">
              <div className="w-6 h-6 border-3 border-gray-200 border-t-0 border-l-0 animate-spin rounded-full"></div>
            </div>
          ) : (
            <button
              onClick={handleSignup}
              className="md:text-xl cursor-pointer font-thin py-1 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
            >
              Sign Up
            </button>
          )}

          <div className="text-center text-sm pt-4">
            already have an account ?{" "}
            <Link
              to="/login"
              className="px-1 underline text-blue-400 hover:text-blue-300"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
