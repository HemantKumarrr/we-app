import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/features/auth.slice";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpToSend = otp.join("");
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const verifySignup = async () => {
    try {
      const response = await api.post(
        "/verify-otp",
        { email, otp: otpToSend },
        { withCredentials: true }
      );
      console.log(response);
      dispatch(setCredentials({ user: response.data.data }));
      navigate("/");
      toast.success("Logged in");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          OTP Verification
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Enter the 4-digit OTP sent to your email
          <br />
          <strong>Check in your spam box</strong>
        </p>
        <div className="flex justify-center gap-3 my-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 bg-zinc-300 text-black text-xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={verifySignup}
          className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Verify OTP
        </button>
        <p className="text-gray-600 text-sm text-center mt-4">
          Didn’t receive the code?{" "}
          <span className="text-blue-600 cursor-pointer">Resend OTP</span>
        </p>
      </div>
    </div>
  );
};

export default OTP;
