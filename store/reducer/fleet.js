import { ADD_FLEET, REMOVE_FLEET } from "../action/fleet";
import Fleet from "../../shared/models/fleet";

const initialState = {
  fleets: {},
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
