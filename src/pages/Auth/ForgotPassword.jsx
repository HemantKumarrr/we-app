import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import { TbLockPassword } from "react-icons/tb";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [succesToggle, setSuccessToggle] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/forgot-password", { email });
      setSuccessToggle(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Forgot Password - We.</title>
        <link rel={`https://mysite.com/forgot-password`} />
        <meta
          name="description"
          content="forgot password enter your email to change password and get back to your account"
        />
      </Helmet>
      <div className="px-20 pt-18">
        <div className="card">
          <h1 className="text-2xl font-semibold text-gray-300 flex items-center gap-2">
            Forgot Password
            <TbLockPassword />
          </h1>
          <div className="flex items-center flex-col gap-2 justify-center pt-8">
            {succesToggle ? (
              <div className="border rounded-2xl border-gray-400 flex flex-col items-center justify-center gap-5 py-8 px-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-semibold">Success</h1>
                  <img src="/images/success.svg" alt="success" />
                </div>
                <p className="text-gray-600">
                  password reset link sent to <strong>{email}</strong>
                  <span className="font-semibold text-center block">
                    Check In Spam Section
                  </span>
                </p>
                <Link to="/login" className="text-blue-600 text-center">
                  Login ?
                </Link>
              </div>
            ) : (
              <>
                <form className="border rounded-2xl border-gray-400 flex flex-col justify-center gap-5 py-8 px-4">
                  <label htmlFor="email" className="text-lg text-gray-300">
                    enter your email
                  </label>
                  <input
                    className="border-none outline outline-bone bg-zinc-800 px-4 py-2 rounded-md"
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    onClick={handleForgotPassword}
                    className="bg-cyan-600 text-white px-30 py-1 hover:bg-cyan-500 cursor-pointer"
                  >
                    Reset password
                  </button>
                </form>
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-400 text-center"
                >
                  Login ?
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
