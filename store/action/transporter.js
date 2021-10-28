import { environment } from "../../environment/environment";

const api = environment.api;
export const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
export const RESET_FORM = "RESET_FORM";
export const GET_TRANS_PROF = "GET_TRANS_PROF";

const requestedUrl = {
  GET_TPORT_PROF: "gettransprofile",
  UPDATE_TPORT_PROFILE: "transupdate",
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

export const getTransporterProfile = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.tid;
    const response = await fetch(api + requestedUrl.GET_TPORT_PROF, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tid: userId,
      }),
    });
    if (!response.ok) {
      throw new Error(
        "Something went wrong while getting transporter profile."
      );
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    dispatch({
      type: GET_TRANS_PROF,
      transp: result.Records[0],
    });

    return await result;
  };
};

export const updateTransporterProfile = (data) => {
  return async (dispatch, getState) => {
    data.tid = getState().auth.tid;
    const response = await fetch(api + requestedUrl.UPDATE_TPORT_PROFILE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(
        "Something went wrong while updating transporter profile."
      );
    }
    const result = await response.json();
    if (result.Result === "NOTOK") {
      throw new Error(result.Msg);
    }

    return await result;
  };
};
