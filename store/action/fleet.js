import { environment } from "../../environment/environment";

const api = environment.api;

const requestedUrl = {
  GETVEHTYPE: "getvtyp",
  GET_REGFLEETS: "getfleets",
  DELETE_FLEET: "deletefleet",
  UPDATE_FLEET: "updatefleet",
  GET_FLEET_INFO: "getFleetinfo",
  DELETE_FLEET_INFO: "deleteFleetinfo",
  FLEET_INFO_SAVE: "saveFleetinfo",
  REG_NEWFLEET: "fleetsregistr",
};

export const ADD_FLEET = "ADD_FLEET";
export const REMOVE_FLEET = "REMOVE_FLEET";
export const RESET_FLEET = "RESET_FLEET";
export const GET_FLEETS = "GET_FLEETS";
export const GET_SERVICES = "GET_SERVICES";

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

export const vehicleServices = (vehid) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.GET_FLEET_INFO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vehid }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while getting fleet information.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    dispatch({
      type: GET_SERVICES,
      services: result.Records,
    });
    return await result;
  };
};

export const deleteFleetInfo = (infoid) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.DELETE_FLEET_INFO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ infoid }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while deleting fleet information.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const saveFleetInfo = (data) => {
  return async (dispatch, getState) => {
    const response = await fetch(api + requestedUrl.FLEET_INFO_SAVE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tid: getState().auth.tid, ...data }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while saving fleet information.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const regNewFleet = (data) => {
  return async (dispatch, getState) => {
    const response = await fetch(api + requestedUrl.REG_NEWFLEET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tid: getState().auth.tid, ...data }),
    });
    if (!response.ok) {
      throw new Error(
        "Something went wrong while registering new fleet information."
      );
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};
