import { ADD_FLEET, REMOVE_FLEET } from "../action/fleet";
import Fleet from "../../shared/models/fleet";

const initialState = {
  fleets: {
    "MH35 V0498": {
      vehno: "MH35 V0498",
      vtypnm: "TATA 407/EICHER 14FT (4 TON)",
      vtypid: 1,
      vehregdte: "01-04-2021",
      vehinsexpdte: "26-11-2021",
      vehinsuno: 12464141,
      vehchesino: 12464141,
      vehphoto: "",
      vehregfle: "",
      vehinsurancedoc: "",
      vehfitcetexpdte: "",
      vehfitcetphoto: "",
      vehpucexpdte: "",
      vehpucphoto: [],
    },
    "MH35 V0499": {
      vehno: "MH35 V0499",
      vtypnm: "TATA 407/EICHER 14FT (4 TON)",
      vtypid: 2,
      vehregdte: "01-04-2021",
      vehinsexpdte: "26-11-2021",
      vehinsuno: 12464141,
      vehchesino: 12464141,
      vehphoto: "",
      vehregfle: "",
      vehinsurancedoc: "",
      vehfitcetexpdte: "",
      vehfitcetphoto: "",
      vehpucexpdte: "",
      vehpucphoto: [],
    },
    "MH35 V0500": {
      vehno: "MH35 V0500",
      vtypnm: "TATA 407/EICHER 14FT (4 TON)",
      vtypid: 3,
      vehregdte: "01-04-2021",
      vehinsexpdte: "26-11-2021",
      vehinsuno: 12464141,
      vehchesino: 12464141,
      vehphoto: "",
      vehregfle: "",
      vehinsurancedoc: "",
      vehfitcetexpdte: "",
      vehfitcetphoto: "",
      vehpucexpdte: "",
      vehpucphoto: [],
    },
    "MH35 V0501": {
      vehno: "MH35 V0501",
      vtypnm: "TATA 407/EICHER 14FT (4 TON)",
      vtypid: 4,
      vehregdte: "01-04-2021",
      vehinsexpdte: "26-11-2021",
      vehinsuno: 12464141,
      vehchesino: 12464141,
      vehphoto: "",
      vehregfle: "",
      vehinsurancedoc: "",
      vehfitcetexpdte: "",
      vehfitcetphoto: "",
      vehpucexpdte: "",
      vehpucphoto: [],
    },
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_FLEET:
      const addedFleet = action.fleet;
      const updatedNewFleet = new Fleet(
        addedFleet.vtypid,
        addedFleet.vtypnm,
        addedFleet.vehno,
        addedFleet.vehregdte,
        addedFleet.vehinsexpdte,
        addedFleet.vehinsuno,
        addedFleet.vehchesino,
        addedFleet.vehphoto,
        addedFleet.vehregfle,
        addedFleet.vehinsurancedoc,
        addedFleet.vehfitcetexpdte,
        addedFleet.vehfitcetphoto,
        addedFleet.vehpucexpdte,
        addedFleet.vehpucphoto
      );
      return {
        ...state,
        fleets: {
          ...state.fleets,
          [addedFleet.vehno]: updatedNewFleet,
        },
      };

    case REMOVE_FLEET:
      //   const selectedFleet = state.fleets[action.fid];
      const updatedFleets = { ...state.fleets };
      delete updatedFleets[action.fid];
      return {
        ...state,
        fleets: updatedFleets,
      };

    default:
      return state;
  }
};
