import { GET_BIDDINGS, CONFIRM_BIDDING } from "../action/biding";
import Biding from "../../shared/models/biding";

const initialState = {
  biddings: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_BIDDINGS:
      updatedBiddings = action.biddings.map(
        (biding) =>
          new Biding(
            biding.amount,
            biding.bidamt,
            biding.bidid,
            biding.canclby,
            biding.canclreson,
            biding.compnynme,
            biding.contactnme,
            biding.contactno,
            biding.contractid,
            biding.date,
            biding.dertid,
            biding.distance,
            biding.drivername,
            biding.email,
            biding.endon,
            biding.flexdate,
            biding.fromLocn,
            biding.iconimage,
            biding.limit,
            biding.loadWeight,
            biding.loadphoto,
            biding.loadtype,
            biding.offset,
            biding.pickupdate,
            biding.rate,
            biding.rating,
            biding.starton,
            biding.status,
            biding.sts,
            biding.tid,
            biding.toLocn,
            biding.totalprice,
            biding.tripcanclsts,
            biding.trnsfrm,
            biding.trnsto,
            biding.trpenddte,
            biding.trpstartdte,
            biding.updton,
            biding.usrid,
            biding.vehphoto,
            biding.vehtyid,
            biding.vehtyp,
            biding.vehtype,
            biding.weight,
            biding.weightype
          )
      );
      return {
        ...state,
        biddings: updatedBiddings,
      };
    case CONFIRM_BIDDING:
      return initialState;
    default:
      return state;
  }
};
