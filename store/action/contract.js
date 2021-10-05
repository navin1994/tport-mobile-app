import { environment } from "../../environment/environment";

const api = environment.api;

const requestedUrl = {
  GET_LOCATIONS: "getLocations",
  GET_ESTIMATE: "searchEstimates",
  SAVE_CONTRACT: "saveTportContract",
};

export const getLocations = (loctyp) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.GET_LOCATIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loctype: loctyp, locunder: "0" }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while getting locations.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const getEstimate = (data) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.GET_ESTIMATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while getting estimate.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const saveTPortContract = (data) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.SAVE_CONTRACT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while saving contract.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};
