import * as authActions from "../../store/action/auth";

export const userIdValObj = {
  avlFlag: false,
  flag: true,
  errorMsg: "",
};

export const userIdValidator = async (loginId, dispatch) => {
  if (loginId.length === 0) {
    return userIdValObj;
  }
  if (loginId.indexOf(" ") >= 0) {
    return {
      avlFlag: false,
      flag: false,
      errorMsg: "User Id should not contain the space",
    };
  }
  try {
    const resData = await dispatch(authActions.checkUserId(loginId));

    if (resData.Result === "ERR") {
      return {
        avlFlag: false,
        flag: false,
        errorMsg:
          "User ID invalid / already exists, please try another user id.",
      };
    } else if (resData.Result === "OK") {
      return {
        avlFlag: true,
        flag: true,
        errorMsg: "",
      };
    }
  } catch (err) {
    throw new Error(err);
  }
};
