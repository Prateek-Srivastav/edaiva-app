import { authClient as client } from "./client";

const login = (email, password) =>
  client.post("/user/login/", { email, password });

const forgotPassword = (email) =>
  client.get(`/user/forgot-password/`, { email });

const register = (data) => client.post("user/user-register/", data);

const resendOtp = (email) => client.post("user/resend_otp/", { email });

const verifyOtp = (data) => client.post("user/otp_verification/", data);

const googleLogin = (accessToken) =>
  client.get("user/callback/google-app", {
    access_token: accessToken,
    platform: "app",
  });

const getLinkedinLogin = () => client.get("/user/login/linkedin");

const linkedinLogin = (accessToken) =>
  client.get("user/callback/linkedin", { code: accessToken, platform: "app" });

export default {
  login,
  forgotPassword,
  register,
  resendOtp,
  verifyOtp,
  googleLogin,
  getLinkedinLogin,
  linkedinLogin,
};
