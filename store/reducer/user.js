import {
  FORM_INPUT_UPDATE,
  RESET_FORM,
  GET_USER_PROFILE,
} from "../action/user";

const initialFormState = {
  inputValues: {
    seq: 1,
    company_name: "",
    company_regno_doc: "",
    company_reg_address: "",
    company_gstn: "",
    company_gstn_doc: "",
    owner_name: "",
    owner_mobile: "",
    owner_email: "",
    owner_address: "",
    owner_idno_doc: "",
    loginid: "",
  },
  inputValidities: {
    seq: true,
    company_name: true,
    company_regno_doc: true,
    company_reg_address: true,
    company_gstn: true,
    company_gstn_doc: true,
    owner_name: false,
    owner_mobile: false,
    owner_email: true,
    owner_address: false,
    owner_idno_doc: false,
    loginid: true,
  },
  formIsValid: false,
};

export default (state = initialFormState, action) => {
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid,
      };

    case RESET_FORM:
      return state;

    case GET_USER_PROFILE:
      const updtedValues = {
        seq: action.user.seq,
        company_name: action.user.company_name,
        company_regno_doc: action.user.company_regno_doc,
        company_reg_address: action.user.company_reg_address,
        company_gstn: action.user.company_gstn,
        company_gstn_doc: action.user.company_gstn_doc,
        owner_name: action.user.owner_name,
        owner_mobile: action.user.owner_mobile,
        owner_email: action.user.owner_email,
        owner_address: action.user.owner_address,
        owner_idno_doc: action.user.owner_idno_doc,
        loginid: action.user.loginid,
      };

      let updtedValidities = {
        seq: true,
        company_name: true,
        company_regno_doc: true,
        company_reg_address: true,
        company_gstn: true,
        company_gstn_doc: true,
        owner_name: true,
        owner_mobile: true,
        owner_email: true,
        owner_address: true,
        owner_idno_doc: action.user.owner_idno_doc !== null ? true : false,
        loginid: true,
      };
      let formIsValidFlag = true;
      for (const key in updtedValidities) {
        formIsValidFlag = formIsValidFlag && updtedValidities[key];
      }
      return {
        inputValues: updtedValues,
        inputValidities: updtedValidities,
        formIsValid: formIsValidFlag,
      };

    default:
      return state;
  }
};
