export const ADD_FLEET = "ADD_FLEET";
export const REMOVE_FLEET = "REMOVE_FLEET";

export const addFleet = (fleet) => {
  return { type: ADD_FLEET, fleet: fleet };
};

export const removeFleet = (fleetId) => {
  return { type: REMOVE_FLEET, fid: fleetId };
};
