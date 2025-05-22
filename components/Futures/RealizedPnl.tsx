// import package
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import lib
import { realizedPnL } from "../../lib/bybit";
import { toFixed } from "../../lib/roundOf";

const RealizedProfitLoss = (props: any) => {
  const { positionDetail } = props;

  const { marketData, tradePair } = useSelector(
    (state: any) => state.perpetual
  );
  const [value, setValue] = useState<number>(0);
  // function
  useEffect(() => {
    if (marketData) {
      if (marketData._id == positionDetail.pairId) {
        setValue(
          toFixed(
            realizedPnL({
              entryPrice: positionDetail.entryPrice,
              exitPrice: marketData.markPrice || positionDetail.entryPrice,
              quantity: positionDetail.quantity,
              side: positionDetail.side,
              takerFee: tradePair.takerFee,
            }),
            tradePair.quoteFloatDigit
          )
        );
      }
    }
  }, [positionDetail, marketData]);
  return (
    <>
      {value > 0 ? (
        <span className="text-success">{value}</span>
      ) : (
        <span className="text-danger">{value}</span>
      )}
    </>
  );
};

export default RealizedProfitLoss;
