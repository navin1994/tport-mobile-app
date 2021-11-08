import {
  GET_PREFERENCES,
  ADD_PREFERENCE,
  REMOVE_PREFERENCE,
  RESET_PREFERENCE,
} from "../action/preferences";
import Preference from "../../shared/models/preferences";

const initialState = {
  preferences: [],
  unsavedPref: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PREFERENCES:
      const preference = action.pref;
      const newPref = preference.map(
        (prefer) =>
          new Preference(
            prefer.charges,
            prefer.email,
            prefer.extramt,
            prefer.fleetType,
            prefer.fleetids,
            prefer.fleets,
            prefer.fletids,
            prefer.isLoad,
            prefer.isUnLoad,
            prefer.loadamt,
            prefer.locid,
            prefer.locnid,
            prefer.locnm,
            prefer.mobile,
            prefer.name,
            prefer.pref,
            prefer.preffid,
            prefer.rateamt,
            prefer.ratetyp,
            prefer.tid,
            prefer.unloadamt,
            prefer.vtypid,
            prefer.vtypnm
          )
      );
      return {
        ...state,
        preferences: newPref,
      };

    case ADD_PREFERENCE:
      const addedPref = action.preference;
      const newPrefer = {
        seleFleets: addedPref.seleFleets,
        seleFrmLocn: addedPref.seleFrmLocn,
        seleToLocn: addedPref.seleToLocn,
        isLoad: addedPref.isLoad,
        loadamt: addedPref.loadamt,
        isUnLoad: addedPref.isUnLoad,
        unloadamt: addedPref.unloadamt,
        ratetyp: addedPref.ratetyp,
        rateamt: addedPref.rateamt,
        extramt: addedPref.extramt,
      };
      return {
        ...state,
        unsavedPref: [...state.unsavedPref, newPrefer],
      };

    case REMOVE_PREFERENCE:
      let updatedPref = [...state.unsavedPref];
      updatedPref.splice(action.indx);
      return {
        ...state,
        unsavedPref: updatedPref,
      };
    case RESET_PREFERENCE:
      return {
        ...state,
        unsavedPref: [],
      };
    default:
      return state;
  }
};
