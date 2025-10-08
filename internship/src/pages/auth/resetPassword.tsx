import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { verifyEmail, sendEmailOtp, verifyEmailOtp } from "../../utils/authUtils";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    enteredOtp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [otpStatus, setOtpStatus] = useState({
    isOtpSent: false,
    isOtpVerified: false,
  });

  const [loadingState, setLoadingState] = useState({
    sendingOtp: false,
    verifyingOtp: false,
    resettingPassword: false,
  });

  const [otpTimer, setOtpTimer] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  // OTP Timer Effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleSendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Check if email exists
    const doesEmailExist = await verifyEmail(formData.email);
    if (!doesEmailExist.IsSuccess) {
      setErrorMessage("Email not found. Please check your email or sign up.");
      return;
    }

    setLoadingState({ sendingOtp: true, verifyingOtp: false, resettingPassword: false });

    try {
      const otpResponse = await sendEmailOtp(formData.email);
      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });

      if (!otpResponse.IsSuccess) {
        setErrorMessage(otpResponse.message);
        return;
      }

      setOtpStatus({ ...otpStatus, isOtpSent: true });
      setOtpTimer(60);
      setSuccessMessage("OTP sent successfully! Please check your email.");
    } catch {
      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoadingState({ sendingOtp: true, verifyingOtp: false, resettingPassword: false });

    try {
      const otpResponse = await sendEmailOtp(formData.email);
      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });

      if (!otpResponse.IsSuccess) {
        setErrorMessage(otpResponse.message);
        return;
      }

      setOtpTimer(60);
      setSuccessMessage("OTP resent successfully! Please check your email.");
      setFormData({ ...formData, enteredOtp: "" });
    } catch {
      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });
      setErrorMessage("Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.enteredOtp || formData.enteredOtp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoadingState({ sendingOtp: false, verifyingOtp: true, resettingPassword: false });

    try {
      const otpResponse = await verifyEmailOtp(formData.email, formData.enteredOtp);
      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });

      if (!otpResponse.IsSuccess) {
        setErrorMessage(otpResponse.message);
        return;
      }

      setOtpStatus({ ...otpStatus, isOtpVerified: true });
      setSuccessMessage("OTP verified successfully! Please set your new password.");
    } catch {
      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });
      setErrorMessage("Failed to verify OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: true });

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });

      if (response.data.IsSuccess) {
        setSuccessMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMessage(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      setLoadingState({ sendingOtp: false, verifyingOtp: false, resettingPassword: false });
      const errorMsg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpStatus.isOtpSent) {
      await handleSendOtp();
    } else if (otpStatus.isOtpSent && !otpStatus.isOtpVerified) {
      await handleVerifyOtp();
    } else if (otpStatus.isOtpVerified) {
      await handleResetPassword();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            {!otpStatus.isOtpSent
              ? "Enter your email to receive an OTP"
              : !otpStatus.isOtpVerified
              ? "Enter the OTP sent to your email"
              : "Create your new password"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !otpStatus.isOtpSent ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                }`}
              >
                {otpStatus.isOtpSent ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <span className="text-xs mt-1 text-gray-600">Verify Email</span>
            </div>
            <div
              className={`h-1 flex-1 ${otpStatus.isOtpSent ? "bg-green-500" : "bg-gray-200"}`}
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
                {otpStatus.isOtpVerified ? <CheckCircle className="h-5 w-5" /> : "2"}
              </div>
              <span className="text-xs mt-1 text-gray-600">Verify OTP</span>
            </div>
            <div
              className={`h-1 flex-1 ${otpStatus.isOtpVerified ? "bg-green-500" : "bg-gray-200"}`}
            ></div>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !otpStatus.isOtpVerified ? "bg-gray-200 text-gray-400" : "bg-blue-600 text-white"
                }`}
              >
                3
              </div>
              <span className="text-xs mt-1 text-gray-600">New Password</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          {!otpStatus.isOtpSent && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john.doe@example.com"
              />
            </div>
          )}

          {/* OTP Field */}
          {otpStatus.isOtpSent && !otpStatus.isOtpVerified && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                OTP <span className="text-green-600">(Sent to {formData.email} ✓)</span>
              </label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  required
                  value={formData.enteredOtp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setFormData({ ...formData, enteredOtp: value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Mail className="h-4 w-4 text-green-500" />
                </div>
              </div>
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
            </div>
          )}

          {/* New Password Fields */}
          {otpStatus.isOtpVerified && (
            <>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must include uppercase, lowercase, number, and special character
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loadingState.sendingOtp ||
              loadingState.verifyingOtp ||
              loadingState.resettingPassword
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
            ) : loadingState.resettingPassword ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Resetting Password...
              </>
            ) : !otpStatus.isOtpSent ? (
              "Send OTP"
            ) : otpStatus.isOtpSent && !otpStatus.isOtpVerified ? (
              "Verify OTP"
            ) : (
              "Reset Password"
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

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
