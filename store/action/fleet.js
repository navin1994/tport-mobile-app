import { environment } from "../../environment/environment";

const api = environment.api;

const requestedUrl = {
  GETVEHTYPE: "getvtyp",
  GET_REGFLEETS: "getfleets",
  DELETE_FLEET: "deletefleet",
  UPDATE_FLEET: "updatefleet",
};

export const ADD_FLEET = "ADD_FLEET";
export const REMOVE_FLEET = "REMOVE_FLEET";
export const RESET_FLEET = "RESET_FLEET";
export const GET_FLEETS = "GET_FLEETS";

export const addFleet = (fleet) => {
  return { type: ADD_FLEET, fleet: fleet };
};

export const removeFleet = (fleetId) => {
  return { type: REMOVE_FLEET, fid: fleetId };
};

export const resetFleet = () => {
  return { type: RESET_FLEET };
};

export const getVehicleTypes = () => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.GETVEHTYPE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while getting vehicle types.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const getFleetsData = (v_id) => {
  return async (dispatch, getState) => {
    const response = await fetch(api + requestedUrl.GET_REGFLEETS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tid: getState().auth.tid, v_id }),
    });
    if (!response.ok) {
      throw new Error(
        "Something went wrong while getting registered fleets data."
      );
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    dispatch({
      type: GET_FLEETS,
      fleets: result.Records,
    });
    return await result;
  };
};

export const deleteFleet = (v_id) => {
  return async (dispatch, getState) => {
    const response = await fetch(api + requestedUrl.DELETE_FLEET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tid: getState().auth.tid, v_id }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while deleting fleet.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const updateFleet = (data) => {
  return async (dispatch, getState) => {
    const response = await fetch(api + requestedUrl.UPDATE_FLEET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tid: getState().auth.tid, ...data }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while deleting fleet.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};
