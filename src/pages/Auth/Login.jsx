import { EyeOff, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/features/auth.slice";
import { useGoogleLogin } from "@react-oauth/google";
import { api, googleAuth } from "../../api/api";
import GoogleSVG from "./GoogleSVG";

const Login = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userData.email === "" || userData.password === "")
      return toast.error("fill all the fields");

    setIsLoading(true);
    try {
      const response = await api.post("/login", userData, {
        withCredentials: true,
      });
      dispatch(setCredentials(response.data));
      toast.success("Logged in");
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.error);
    }
    setUserData({ email: "", password: "" });
    setIsLoading(false);
  };

  const responseGoolge = async (authResult) => {
    try {
      if (authResult["code"]) {
        setIsLoading(true);
        const respose = await googleAuth(authResult.code);
        const { user } = respose.data;
        console.log("GOOGLE RESPONSE: " + user);
        dispatch(setCredentials({ user }));
        setIsLoading(false);
        navigate("/");
      } else {
        console.error(authResult);
        setIsLoading(false);
        toast.error("something went wrong");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoolge,
    onError: responseGoolge,
    flow: "auth-code",
  });

  return (
    <div className="w-full pt-20">
      <div className="card flex flex-col items-center justify-center h-full">
        <h1 className="md:text-4xl text-2xl font-bold uppercase text-gray-400">
          welcome Back !
        </h1>
        <form className="flex flex-col md:w-[550px] gap-4 p-4 rounded-xs">
          <label htmlFor="email" className="md:text-xl">
            E-mail
          </label>
          <input
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            autoFocus
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
          <Link
            to="/auth/forgot-password"
            className="text-blue-500 hover:text-blue-400 text-xs md:text-sm underline"
          >
            forgot password ?
          </Link>
          {isLoading ? (
            <div className="text-2xl flex items-center justify-center py-2 mt-4 bg-blue-400 cursor-not-allowed text-white rounded-md">
              <div className="w-6 h-6 border-3 border-gray-200 border-t-0 border-l-0 animate-spin rounded-full"></div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="md:text-xl font-thin cursor-pointer py-1 mt-4 hover:bg-blue-500 bg-blue-600 text-white rounded-md"
            >
              Login
            </button>
          )}
          <div
            onClick={googleLogin}
            className="googlelogin flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-800 border border-gray-400 rounded-full text-center py-2"
          >
            <GoogleSVG />{" "}
            <p className="text-xs md:text-md">Login with Google</p>
          </div>
          <div className="text-center text-sm pt-4">
            Create account ?{" "}
            <Link
              to="/signup"
              className="px-1 underline text-blue-400 hover:text-blue-300"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
