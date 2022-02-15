import { authClient as client } from "./client";

const login = (email, password) =>
  client.post("/user/login/", { email, password });

const forgotPassword = (email) =>
  client.get(`/user/forgot-password/`, { email });

const register = (data) => client.post("user/user-register/", data);

const resendOtp = (email) => client.post("user/resend_otp/", { email });

const verifyOtp = (data) => client.post("user/otp_verification/", data);

const googleLogin = (accessToken) =>
  client.get("user/callback/google-app", { access_token: accessToken });

const linkedinLogin = (access_token) =>
  client.get("user/callback/linkedin-app", { access_token });

export default {
  login,
  forgotPassword,
  register,
  resendOtp,
  verifyOtp,
  googleLogin,
  linkedinLogin,
};
