import { environment } from "../../environment/environment";

const api = environment.api;
export const GET_CONTRACTS = "GET_CONTRACTS";

const requestedUrl = {
  GET_LOCATIONS: "getLocations",
  GET_ESTIMATE: "searchEstimates",
  SAVE_CONTRACT: "saveTportContract",
  GET_TPORT_CONTRACT: "getTportContract",
  SEARCH_CONTRACTS: "getsearchContract",
  CANCEL_CONTRACT: "cancelcontract",
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

export const getContracts = (limit, offset) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const response = await fetch(api + requestedUrl.GET_TPORT_CONTRACT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: limit, offset: offset, usrid: userId }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while fetching contracts.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    dispatch({
      type: GET_CONTRACTS,
      contracts: result.Records,
      totalContracts: result.rscnt,
      offset: offset,
    });

    return await result;
  };
};

export const searchContracts = (fromLocn, toLocn, pickupdate) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const response = await fetch(api + requestedUrl.SEARCH_CONTRACTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fromLocn: fromLocn,
        toLocn: toLocn,
        pickupdate: pickupdate,
        usrid: userId,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while searching contracts.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    dispatch({
      type: GET_CONTRACTS,
      contracts: result.Records,
      totalContracts: result.rscnt,
      offset: 0,
    });

    return await result;
  };
};

export const cancelContract = (contractid, canclreson) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const response = await fetch(api + requestedUrl.CANCEL_CONTRACT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tid: userId,
        contractid,
        canclreson,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while cancelling the contracts.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};
