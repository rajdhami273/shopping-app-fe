import httpClient from "../../utils/httpClient";

import { setAccessToken, logout } from "../slices/userSlice";

let withCredentials = false;
export function callAPI(url, method, _data, ...callbacks) {
  return async (dispatch, getState) => {
    try {
      const { accessToken } = getState().user;
      let headers = {};
      if (accessToken) {
        headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }
      let apiCall;
      if (method === "post" || method === "put" || method === "delete") {
        apiCall = httpClient.post(url, _data, {
          headers,
          withCredentials,
        });
      } else if (method === "get") {
        apiCall = httpClient.get(url, { headers, withCredentials });
      }
      const { data } = await apiCall;
      if (callbacks) {
        callbacks.forEach((callback) => {
          dispatch(callback(data));
        });
      }
    } catch (error) {
      console.error("Error calling API: ", error);
      if (error.response?.status === 401) {
        withCredentials = true;
        setAccessToken(null);
        const data = await refreshAccessToken();
        console.log("Data is: ", data);
        dispatch(setAccessToken(data?.accessToken));
        withCredentials = false;
        if (data) {
          return dispatch(callAPI(url, method, _data, ...callbacks));
        } else {
          dispatch(logout());
          window.location.href = "/auth/login";
        }
      }
    }
  };
}

async function refreshAccessToken() {
  try {
    const { data } = await httpClient.get("/auth/refresh-access-token", {
      withCredentials,
    });
    return data.data;
  } catch (error) {
    console.error("Error refreshing access token: ", error);
  }
  return null;
}
