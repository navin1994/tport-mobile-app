import { environment } from "../../environment/environment";

const api = environment.api;
export const LOGIN = "LOGIN";

const requestedUrl = {
  CHECK_USER_ID: "checkloginid",
  USER_REGISTRATION: "customerRegstr",
  LOGIN: "loginaction",
  GETVEHTYPE: "getvtyp",
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

export const login = (loginData) => {
  return async (dispatch) => {
    const response = await fetch(api + requestedUrl.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginid: loginData.userId,
        pwd: loginData.password,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong while login.");
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }
    dispatch({
      type: LOGIN,
      docflag: result.Record.docflag,
      email: result.Record.email,
      loginid: result.Record.loginid,
      mobile: result.Record.mobile,
      seq: result.Record.seq,
      sts: result.Record.sts,
      tid: result.Record.tid,
      usrnme: result.Record.usrnme,
      usrtyp: result.Record.usrtyp,
    });
    return await result;
  };
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
