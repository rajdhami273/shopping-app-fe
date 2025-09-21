import httpClient from "../../utils/httpClient";

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
      const { data } = await httpClient[method](url, _data, { headers });
      if (callbacks) {
        callbacks.forEach((callback) => {
          dispatch(callback(data));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}
