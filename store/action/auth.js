import { environment } from "../../environment/environment";

const api = environment.api;

export const checkUserId = (userId) => {
  return async (dispatch) => {
    const response = await fetch(api + "checkloginid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginid: userId,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while checking user id.");
    }
    return await response.json();
  };
};
