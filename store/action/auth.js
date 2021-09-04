import { environment } from "../../environment/environment";

const api = environment.api;
const requestedUrl = {
  CHECK_USER_ID: "checkloginid",
  USER_REGISTRATION: "customerRegstr",
};

export const checkUserId = (userId) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.CHECK_USER_ID, {
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

export const userRegistration = (userRegData) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.USER_REGISTRATION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cnfpassword: userRegData.confirmPassword,
        loginid: userRegData.userId,
        owner_email: userRegData.emailAddress,
        owner_mobile: userRegData.mobileNumber,
        owner_name: userRegData.ownerName,
        password: userRegData.password,
        termsCondition: userRegData.termsCondition,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while registering the user.");
    }
    return await response.json();
  };
};
