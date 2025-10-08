import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, CheckCircle, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  verifyEmail,
  sendEmailOtp,
  verifyEmailOtp,
} from "../../utils/authUtils";
import axios from "axios";
import { useAuthCheck } from "../../hooks/useAuthCheck";

const API_URL = import.meta.env.VITE_API_URL;

const SignupPage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    enteredOtp: "",
    password: "",
    confirmPassword: "",
  });

  const [otpStatus, setOtpStatus] = useState({
    isOtpSent: false,
    isOtpVerified: false,
  });

  const [loadingState, setLoadingState] = useState({
    sendingOtp: false,
    verifyingOtp: false,
    registering: false,
  });

  const [otpTimer, setOtpTimer] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  const isAuthenticated = useAuthCheck();

  // OTP Timer Effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoadingState({
      sendingOtp: true,
      verifyingOtp: false,
      registering: false,
    });

    try {
      const otpResponse = await sendEmailOtp(userData.email);
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });

      if (!otpResponse.IsSuccess) {
        setErrorMessage(otpResponse.message);
        return;
      }
      setOtpTimer(60); // 60 seconds cooldown
      setSuccessMessage("OTP resent successfully! Please check your email.");
      setUserData({ ...userData, enteredOtp: "" }); // Clear previous OTP
    } catch {
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });
      setErrorMessage("Failed to resend OTP. Please try again.");
    }
  };

  const registerUser = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoadingState({
      sendingOtp: false,
      verifyingOtp: false,
      registering: true,
    });

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });
      console.log("Registration successful:", response.data);
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMsg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Registration failed. Please try again.";
      setErrorMessage(errorMsg);
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const doesEmailExist = await verifyEmail(userData.email);
    if (doesEmailExist.IsSuccess) {
      setErrorMessage(`${doesEmailExist.message}, Please Login`);
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });
      return;
    }

    try {
      if (!otpStatus.isOtpSent) {
        setLoadingState({
          sendingOtp: true,
          verifyingOtp: false,
          registering: false,
        });
        const otpResponse = await sendEmailOtp(
          userData.email,
          "registration to Atomworld"
        );
        setLoadingState({
          sendingOtp: false,
          verifyingOtp: false,
          registering: false,
        });

        if (!otpResponse.IsSuccess) {
          setErrorMessage(otpResponse.message);
          return;
        }
        setOtpStatus({ ...otpStatus, isOtpSent: true });
        setOtpTimer(60); // Start 60 second cooldown
        setSuccessMessage(
          "OTP sent successfully to your email! Please check your inbox."
        );
        return;
      }

      if (otpStatus.isOtpSent && !otpStatus.isOtpVerified) {
        if (!userData.enteredOtp || userData.enteredOtp.length !== 6) {
          setErrorMessage("Please enter a valid 6-digit OTP.");
          return;
        }

        setLoadingState({
          sendingOtp: false,
          verifyingOtp: true,
          registering: false,
        });
        const otpResponse = await verifyEmailOtp(
          userData.email,
          userData.enteredOtp
        );
        setLoadingState({
          sendingOtp: false,
          verifyingOtp: false,
          registering: false,
        });

        if (!otpResponse.IsSuccess) {
          setErrorMessage(otpResponse.message);
          return;
        }
        setOtpStatus({ ...otpStatus, isOtpVerified: true });
        setSuccessMessage(
          "OTP verified successfully! Please set your password."
        );
        return;
      }

      if (otpStatus.isOtpVerified) {
        const res = await registerUser();
        if (res?.IsSuccess) {
          setSuccessMessage("Registration Successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    } catch {
      // Error already set in respective functions
      setLoadingState({
        sendingOtp: false,
        verifyingOtp: false,
        registering: false,
      });
    }
  };

  if (isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here!
            </Link>
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !otpStatus.isOtpSent
                    ? "bg-blue-600 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {otpStatus.isOtpSent ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  "1"
                )}
              </div>
              <span className="text-xs mt-1 text-gray-600">Send OTP</span>
            </div>
            <div
              className={`h-1 flex-1 ${
                otpStatus.isOtpSent ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !otpStatus.isOtpSent
                    ? "bg-gray-200 text-gray-400"
                    : !otpStatus.isOtpVerified
                    ? "bg-blue-600 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {otpStatus.isOtpVerified ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  "2"
                )}
              </div>
              <span className="text-xs mt-1 text-gray-600">Verify OTP</span>
            </div>
            <div
              className={`h-1 flex-1 ${
                otpStatus.isOtpVerified ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !otpStatus.isOtpVerified
                    ? "bg-gray-200 text-gray-400"
                    : "bg-blue-600 text-white"
                }`}
              >
                3
              </div>
              <span className="text-xs mt-1 text-gray-600">Register</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={userData.firstName}
                onChange={(e) =>
                  setUserData({ ...userData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={userData.lastName}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              // type="email"
              required
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john.doe@example.com"
            />
          </div>

          {/* Password */}
          {otpStatus.isOtpVerified ? (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={userData.password}
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={userData.confirmPassword}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                OTP{" "}
                {otpStatus.isOtpSent && (
                  <span className="text-green-600">(Sent ✓)</span>
                )}
              </label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  required
                  disabled={!otpStatus.isOtpSent}
                  value={userData.enteredOtp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setUserData({ ...userData, enteredOtp: value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100"
                  placeholder={
                    otpStatus.isOtpSent
                      ? "Enter 6-digit OTP"
                      : "Click 'Send OTP' first"
                  }
                  maxLength={6}
                />
                {otpStatus.isOtpSent && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Mail className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              {otpStatus.isOtpSent && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    OTP valid for 5 minutes. Check your email inbox/spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpTimer > 0 || loadingState.sendingOtp}
                    className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              type="checkbox"
              required
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 block text-sm text-gray-700"
            >
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={
              loadingState.sendingOtp ||
              loadingState.verifyingOtp ||
              loadingState.registering
            }
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loadingState.sendingOtp ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Sending OTP...
              </>
            ) : loadingState.verifyingOtp ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Verifying OTP...
              </>
            ) : loadingState.registering ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Creating Account...
              </>
            ) : !otpStatus.isOtpSent ? (
              "Send OTP"
            ) : otpStatus.isOtpSent && !otpStatus.isOtpVerified ? (
              "Verify OTP"
            ) : (
              "Create Account"
            )}
          </button>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-start">
                <span className="mr-2">⚠️</span>
                <span>{errorMessage}</span>
              </p>
            </div>
          )}

          {/* Success Message Display */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 flex items-start">
                <span className="mr-2">✓</span>
                <span>{successMessage}</span>
              </p>
            </div>
          )}
        </form>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
