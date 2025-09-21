import { setUser, setAccessToken } from "../slices/userSlice";
import { callAPI } from "../middlewares/callAPI";

import { logout } from "../slices/userSlice";

export function login(fields) {
  return callAPI(
    "/auth/login",
    "post",
    fields,
    (data) => setAccessToken(data.data.accessToken),
    (data) => setUser(data.data.user)
  );
}

export function register(fields) {
  return callAPI(
    "/auth/register",
    "post",
    fields,
    (data) => setAccessToken(data.data.accessToken),
    (data) => setUser(data.data.user)
  );
}

export function verify(otp) {
  return callAPI("/auth/verify", "post", otp, (data) => {
    console.log("Verify data: ", data);
    return setUser(data.data);
  });
}

export function logoutUser() {
  return callAPI("/auth/logout", "get", null, logout);
}

export function getUser() {
  return callAPI("/user/me", "get", {}, setUser);
}

export function refreshAccessToken() {
  return callAPI("/auth/refresh-access-token", "post", {}, setAccessToken);
}

export function updateUser(fields) {
  return callAPI("/auth/update", "put", fields, setUser);
}
