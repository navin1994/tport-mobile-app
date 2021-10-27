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
  GET_ALLOTED_CONTRACTS: "allotedcontract",
  USER_CONTRACT_HISTORY: "contracthistory",
  LOAD_ACCEPT: "loadaccept",
  TRANS_CONTRACT_HISTORY: "transhistory",
  TPORT_CONTRACT_GET_TRANS: "TportContractTrans",
  TPORT_CONTRACT_BID: "Contractbid",
  CANCEL_BY_TRANSPORTER: "canclbytrans",
  TRIP_START: "tripstart",
  TRIP_END: "tripend",
  SAVE_FEEDBACK: "feedback",
  TRANS_CONFIRM_CONTRACT: "transconfirm",
  UPDATE_DRIVER: "updtdriverdtl",
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
    let data = { limit, offset };
    const userType = getState().auth.usrtyp;
    const endpoint =
      userType === "T"
        ? requestedUrl.TPORT_CONTRACT_GET_TRANS
        : requestedUrl.GET_TPORT_CONTRACT;
    const key = userType === "T" ? "tid" : "userid";
    data[key] = getState().auth.tid;
    const response = await fetch(api + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    const data = {
      fromLocn,
      toLocn,
      pickupdate,
      usrid: userId,
    };
    if (getState().auth.usrtyp === "T") {
      delete data.usrid;
    }
    const response = await fetch(api + requestedUrl.SEARCH_CONTRACTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
    let data = { contractid, canclreson };
    const userType = getState().auth.usrtyp;
    const endpoint =
      userType === "T"
        ? requestedUrl.CANCEL_BY_TRANSPORTER
        : requestedUrl.CANCEL_CONTRACT;
    data["tid"] = getState().auth.tid;
    const response = await fetch(api + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export const getAllotedContracts = () => {
  return async (dispatch, getState) => {
    let data = {};
    const userType = getState().auth.usrtyp;
    const key = userType === "T" ? "tid" : "userid";
    data[key] = getState().auth.tid;
    const response = await fetch(api + requestedUrl.GET_ALLOTED_CONTRACTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
      totalContracts: 0,
      offset: 0,
    });

    return await result;
  };
};

export const searchContractsLocal = (fromLocn, toLocn, pickupdate) => {
  return async (dispatch, getState) => {
    const contracts = getState().contract.contracts;
    const searchedContracts = await Promise.all(
      contracts.filter((contract) => {
        if (
          (contract.trnsfrm.toLowerCase().includes(fromLocn.toLowerCase()) &&
            fromLocn !== "") ||
          (contract.trnsto.toLowerCase().includes(toLocn.toLowerCase()) &&
            toLocn !== "") ||
          (contract.pickupdate
            .toLowerCase()
            .includes(pickupdate.toLowerCase()) &&
            pickupdate !== "")
        ) {
          return contract;
        }
      })
    );

    dispatch({
      type: GET_CONTRACTS,
      contracts: searchedContracts,
      totalContracts: 0,
      offset: 0,
    });

    return await searchedContracts;
  };
};

export const loadAccept = (data) => {
  return async (dispatch, getState) => {
    const userType = getState().auth.usrtyp;
    const endpoint =
      userType === "T" ? requestedUrl.SAVE_FEEDBACK : requestedUrl.LOAD_ACCEPT;
    const response = await fetch(api + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while saving ratings.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const getContractsHistory = () => {
  return async (dispatch, getState) => {
    let data = {};
    const userType = getState().auth.usrtyp;
    const contractHistory =
      userType === "T"
        ? requestedUrl.TRANS_CONTRACT_HISTORY
        : requestedUrl.USER_CONTRACT_HISTORY;
    const key = userType === "T" ? "tid" : "userid";
    data[key] = getState().auth.tid;
    const response = await fetch(api + contractHistory, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
      totalContracts: 0,
      offset: 0,
    });

    return await result;
  };
};

export const saveTPortContractBid = (contractId, bidAmount) => {
  return async (dispatch, getState) => {
    const data = {
      tid: getState().auth.tid,
      contractid: contractId,
      bidamt: bidAmount,
    };
    const response = await fetch(api + requestedUrl.TPORT_CONTRACT_BID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while saving bid.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const tripActions = (contractid, flag) => {
  return async (dispatch) => {
    const endPoint =
      flag === "START" ? requestedUrl.TRIP_START : requestedUrl.TRIP_END;
    const response = await fetch(api + endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractid }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while ending/starting trip.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};

export const transConfirmAndUpdateDriver = (data, flag) => {
  return async (dispatch) => {
    const endPoint =
      flag === "CONFIRM"
        ? requestedUrl.TRANS_CONFIRM_CONTRACT
        : requestedUrl.UPDATE_DRIVER;
    const response = await fetch(api + endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(
        "Something went wrong while confirming/updating contract."
      );
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    return await result;
  };
};
