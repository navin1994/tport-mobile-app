import { GET_CONTRACTS } from "../action/contract";
import Contract from "../../shared/models/contract";

const initialState = {
  contracts: [],
  totalContracts: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTRACTS:
      updatedContracts = action.contracts.map(
        (contract) =>
          new Contract(
            contract.amount,
            contract.bidamt,
            contract.bidid,
            contract.canclby,
            contract.canclreson,
            contract.compnynme,
            contract.contactnme,
            contract.contactno,
            contract.contractid,
            contract.date,
            contract.dertid,
            contract.distance,
            contract.drivername,
            contract.email,
            contract.endon,
            contract.flexdate,
            contract.fromLocn,
            contract.iconimage,
            contract.limit,
            contract.loadWeight,
            contract.loadphoto,
            contract.loadtype,
            contract.offset,
            contract.pickupdate,
            contract.rate,
            contract.rating,
            contract.starton,
            contract.status,
            contract.sts,
            contract.tid,
            contract.toLocn,
            contract.totalprice,
            contract.tripcanclsts,
            contract.trnsfrm,
            contract.trnsto,
            contract.trpenddte,
            contract.trpstartdte,
            contract.updton,
            contract.usrid,
            contract.vehphoto,
            contract.vehtyid,
            contract.vehtyp,
            contract.vehtype,
            contract.weight,
            contract.weightype
          )
      );
      return {
        ...state,
        contracts:
          action.offset === 0
            ? updatedContracts
            : [...state.contracts, ...updatedContracts],
        totalContracts: action.totalContracts,
      };

    default:
      return state;
  }
};
