import { environment } from "../../environment/environment";

const api = environment.api;
export const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
export const RESET_FORM = "RESET_FORM";
export const GET_USER_PROFILE = "GET_USER_PROFILE";

const requestedUrl = {
  GET_USER_PROF: "getProfileData",
  UPDATE_USER_PROF: "updateProfile",
  UPDATE_USER_DATA: "update",
  UPDATE_PASS: "chnagepwd",
};

export const formInputUpdate = (identifier, inputValue, inputValidity) => {
  return {
    type: FORM_INPUT_UPDATE,
    value: inputValue,
    isValid: inputValidity,
    input: identifier,
  };
};
export const resetForm = () => {
  return { type: RESET_FORM };
};

export const getUserProfile = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const response = await fetch(api + requestedUrl.GET_USER_PROF, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        utid: userId,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while getting user profile.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    dispatch({
      type: GET_USER_PROFILE,
      user: result.Record,
    });

    return await result;
  };
};

export const updateUserProfile = (data) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const endPoint =
      getState().auth.docflag === "N"
        ? requestedUrl.UPDATE_USER_PROF
        : requestedUrl.UPDATE_USER_DATA;
    const response = await fetch(api + endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        utid: userId,
        ...data,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while updating user profile.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    return await result;
  };
};

export const updatePassword = (password) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const response = await fetch(api + requestedUrl.UPDATE_PASS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        utid: userId,
        password,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while updating user password.");
    }
    const result = await response.json();
    console.log(result);
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};
