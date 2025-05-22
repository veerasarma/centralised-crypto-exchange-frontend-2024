// import package
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import lib
import { unrealizedPnlInvers } from "../../lib/bybit";
import { toFixed, truncateDecimals } from "../../lib/roundOf";

const UnrealizedProfitLoss = (props: any) => {
  const { positionDetail } = props;
  const tickerData = useSelector((state: any) => state.marketPrice);

  const { marketData, tradePair } = useSelector((state: any) => state.inverse);
  const [value, setValue] = useState<number>(0);
  // function
  useEffect(() => {
    if (marketData) {
      if (marketData._id == positionDetail.pairId) {
        setValue(
          toFixed(
            unrealizedPnlInvers({
              entryPrice: positionDetail.entryPrice,
              quantity: positionDetail.quantity,
              lastPrice: marketData.markPrice || positionDetail.entryPrice,
              buyorsell: positionDetail.side,
            }),
            positionDetail.pairDetail.quoteFloatDigit
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

export default UnrealizedProfitLoss;
