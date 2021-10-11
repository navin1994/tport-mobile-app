import { environment } from "../../environment/environment";

const api = environment.api;
export const GET_BIDDINGS = "GET_BIDDINGS";
export const CONFIRM_BIDDING = "CONFIRM_BIDDING";

const requestedUrl = {
  GET_MIN_BIDS: "getminbids",
  GET_BID_HISTORY: "bidhistory",
  CUST_CONFIRM_CONTRACT: "custmerconfirm",
};

export const getBiddings = (contractid) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.GET_MIN_BIDS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractid: contractid }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while fetching biddings.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    dispatch({
      type: GET_BIDDINGS,
      biddings: result.Records,
    });

    return await result;
  };
};

export const getBiddingHistory = (contractid) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.GET_BID_HISTORY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractid: contractid }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while fetching biddings.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    dispatch({
      type: GET_BIDDINGS,
      biddings: result.Records,
    });

    return await result;
  };
};

export const confirmBiding = (contract) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const response = await fetch(api + requestedUrl.CUST_CONFIRM_CONTRACT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contractid: contract.contractid,
        tid: contract.tid,
        bid_amount: contract.bidamt,
        contractdte: contract.pickupdate,
        userid: userId,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while biding confirmation.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    dispatch({
      type: CONFIRM_BIDDING,
    });

    return await result;
  };
};
