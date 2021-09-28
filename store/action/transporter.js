import { environment } from "../../environment/environment";

const api = environment.api;
export const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
export const RESET_FORM = "RESET_FORM";

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
