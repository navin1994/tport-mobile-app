import { FORM_INPUT_UPDATE, RESET_FORM } from "../action/transporter";

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

    default:
      return state;
  }
};
