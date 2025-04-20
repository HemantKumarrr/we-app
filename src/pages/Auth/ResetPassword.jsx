import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";

const ResetPassword = () => {
  const [password, setPassword] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showPassToggle, setShowPassToggle] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("resetToken", token);
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    console.log(password.newPassword, password.confirmNewPassword);
    if (password.newPassword === "" || password.confirmNewPassword === "")
      return toast.error("empty fields");
    if (password.newPassword !== password.confirmNewPassword)
      return toast.error("passwords doesn't match");

    try {
      const response = await api.post(`/reset-password/${token}`, {
        newPassword: password.newPassword,
      });
      toast.success(response.data.message);
      localStorage.removeItem("resetToken");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="pt-20">
        <form className="flex flex-col w-full items-center justify-center gap-4">
          <h1 className="text-2xl py-4 font-semibold text-gray-00">
            Reset Password
          </h1>
          <input
            value={password.newPassword}
            onChange={(e) =>
              setPassword({ ...password, newPassword: e.target.value })
            }
            className="bg-gray-800 px-4 py-2 rounded-lg outline-none"
            type={showPassToggle ? "text" : "password"}
            placeholder="enter new password"
          />
          <input
            value={password.confirmNewPassword}
            onChange={(e) =>
              setPassword({ ...password, confirmNewPassword: e.target.value })
            }
            className="bg-gray-800 px-4 py-2 rounded-lg outline-none"
            type={showPassToggle ? "text" : "password"}
            placeholder="confirm password"
          />
          <div className="flex items-center justify-start gap-2">
            <input
              onChange={() => setShowPassToggle((prev) => !prev)}
              value={showPassToggle}
              type="checkbox"
              id="showpassword"
            />
            <label htmlFor="showpassword">Show password</label>
          </div>
          <button
            onClick={handleResetPassword}
            className="bg-blue-600 text-white px-8 py-2 rounded-md shadow-lg cursor-pointer active:scale-[0.96]"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
