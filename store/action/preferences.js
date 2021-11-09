import { environment } from "../../environment/environment";

const api = environment.api;

const requestedUrl = {
  TRPRT_LOC_PREF_GET: "getTportPref",
  DELETE_PREFERENCE: "deleteTportPref",
  TRPRT_LOC_PREF_SAVE: "saveTportPref",
};

export const GET_PREFERENCES = "GET_PREFERENCES";
export const ADD_PREFERENCE = "ADD_PREFERENCE";
export const REMOVE_PREFERENCE = "REMOVE_PREFERENCE";
export const RESET_PREFERENCE = "RESET_PREFERENCE";

export const addPreference = (preference) => {
  return { type: ADD_PREFERENCE, preference: preference };
};

export const removePreference = (prId) => {
  return { type: REMOVE_PREFERENCE, id: prId };
};

export const resetPreference = () => {
  return { type: RESET_PREFERENCE };
};

export const getTportPreferences = () => {
  return async (dispatch, getState) => {
    const response = await fetch(api + requestedUrl.TRPRT_LOC_PREF_GET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tid: getState().auth.tid }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while getting preferences.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    dispatch({
      type: GET_PREFERENCES,
      pref: result.Records,
    });
    return await result;
  };
};

export const deleteTportPreferences = (prefId) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.DELETE_PREFERENCE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ preffid: prefId }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while deleting preferences.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const saveTransporterLocanPref = (data) => {
  return async (dispatch, getState) => {
    const response = await fetch(api + requestedUrl.TRPRT_LOC_PREF_SAVE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tid: getState().auth.tid, pref: data }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while saving preferences.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};
