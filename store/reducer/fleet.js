import {
  ADD_FLEET,
  REMOVE_FLEET,
  RESET_FLEET,
  GET_FLEETS,
  GET_SERVICES,
} from "../action/fleet";
import Fleet from "../../shared/models/fleet";

const initialState = {
  fleets: {},
  regFleets: [],
  services: [],
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
    case RESET_FLEET:
      return {
        ...state,
        fleets: {},
      };

    case GET_FLEETS:
      const udtFleets = action.fleets.map(function (fleet) {
        return {
          vehid: fleet.vehid,
          tid: fleet.tid,
          vtypid: fleet.vtypid,
          vtypnm: fleet.vtypnm,
          vehno: fleet.vehno,
          vehchesino: fleet.vehchesino,
          vehinsuno: fleet.vehinsuno,
          vehinsexpdte: fleet.vehinsexpdte,
          vehregdte: fleet.vehregdte,
          vehinsurancedoc: fleet.vehinsurancedoc,
          vehphoto: fleet.vehphoto,
          vehregdoc: fleet.vehregdoc,
          docname: fleet.docname,
          sts: fleet.sts,
          latitude: fleet.latitude,
          longitude: fleet.longitude,
          speed: fleet.speed,
          vehiphoto: fleet.vehiphoto,
          iconimage: fleet.iconimage,
          vehfitcetexpdte: fleet.vehfitcetexpdte,
          vehfitcetphoto: fleet.vehfitcetphoto,
          vehpucexpdte: fleet.vehpucexpdte,
          vehpucphoto: fleet.vehpucphoto,
        };
      });
      return {
        ...state,
        regFleets: udtFleets,
      };

    case GET_SERVICES:
      const updatedSrv = action.services.map(function (src) {
        return {
          changed_date: src.changed_date,
          infoid: src.infoid,
          km_reading: src.km_reading,
          km_run: src.km_run,
          remark: src.remark,
          service_date: src.service_date,
          sts: src.sts,
          tid: src.tid,
          type: src.type,
          tyre_make: src.tyre_make,
          tyre_no: src.tyre_no,
          tyres: src.tyres,
          vehid: src.vehid,
        };
      });
      return {
        ...state,
        services: updatedSrv,
      };

    default:
      return state;
  }
};
