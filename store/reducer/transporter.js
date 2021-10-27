import {
  FORM_INPUT_UPDATE,
  GET_TRANS_PROF,
  RESET_FORM,
} from "../action/transporter";

const initialFormState = {
  inputValues: {
    seq: 1,
    ownrnme: "",
    ownrmobile: "",
    ownremail: "",
    ownraddr: "",
    ownrpincd: "",
    ownrpandoc: "",
    ownridno: "",
    ownrpanno: "",
    ownradhardoc: "",
    loginid: "",
    password: "",
    cnfpassword: "",
    companyname: "",
    companyregno: "",
    comapnypanno: "",
    compincode: "", // not in UI
    companyaddress: "",
    companygstno: "",
    companyregdoc: "",
    companypandoc: "",
    companygstdoc: "",
    evgstnid: "",
    vehclst: [],
  },
  inputValidities: {
    seq: true,
    ownrnme: false,
    ownrmobile: false,
    ownremail: false,
    ownraddr: false,
    ownrpincd: false,
    ownrpandoc: false,
    ownridno: false,
    ownrpanno: false,
    ownradhardoc: false,
    loginid: false,
    password: false,
    cnfpassword: false,
    companyname: true,
    companyregno: true,
    comapnypanno: true,
    compincode: true, // not in UI
    companyaddress: true,
    companygstno: true,
    companyregdoc: true,
    companypandoc: true,
    companygstdoc: true,
    evgstnid: true,
    vehclst: true,
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
      return initialFormState;

    case GET_TRANS_PROF:
      const updtedValues = {
        seq: action.transp.seq,
        companyname: action.transp.companyname,
        company_regno: action.transp.companyregno,
        company_pan: action.transp.comapnypanno,
        companyaddress: action.transp.companyaddress,
        company_gstn: action.transp.companygstno,
        evgstnid: action.transp.evgstnid,
        ownrnme: action.transp.ownrnme,
        ownrmobile: action.transp.ownrmobile,
        ownremail: action.transp.ownremail,
        ownraddr: action.transp.ownraddr,
        ownridno: action.transp.ownridno,
        ownrpanno: action.transp.ownrpanno,
        ownrpincd: action.transp.ownrpincd,
      };

      let updtedValidities = {
        seq: true,
        companyname: true,
        company_regno: true,
        company_pan: true,
        companyaddress: true,
        company_gstn: true,
        evgstnid: true,
        ownrnme: true,
        ownrmobile: true,
        ownremail: true,
        ownraddr: true,
        ownridno: true,
        ownrpanno: true,
        ownrpincd: true,
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
