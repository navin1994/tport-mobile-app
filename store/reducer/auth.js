import { LOGIN } from "../action/auth";

const initialState = {
  docflag: null,
  email: "",
  loginid: "",
  mobile: "",
  seq: null,
  sts: "",
  tid: null,
  usrnme: "",
  usrtyp: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        docflag: action.docflag,
        email: action.email,
        loginid: action.loginid,
        mobile: action.mobile,
        seq: action.seq,
        sts: action.sts,
        tid: action.tid,
        usrnme: action.usrnme,
        usrtyp: action.usrtyp,
      };
    default:
      return state;
  }
};
