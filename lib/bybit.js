export const orderValue = ({ price, quantity }) => {
  try {
    if (price > 0 && quantity > 0) {
      price = parseFloat(price);
      quantity = parseFloat(quantity);
      return price * quantity;
    }
    return 0;
  } catch (err) {
    return 0;
  }
};

export const orderCost = ({
  price,
  quantity,
  leverage,
  takerFee,
  buyorsell,
}) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    leverage = parseFloat(leverage);
    takerFee = parseFloat(takerFee);
    return (
      initialMargin({ price, quantity, leverage }) // +
      // feeToOpen({ price, quantity, takerFee }) +
      // feeToClose({ price, quantity, leverage, takerFee, buyorsell })
    );
  } catch (err) {
    return 0;
  }
};

export const orderQty_old = ({ price, orderCost, leverage, buyorsell }) => {
  try {
    price = parseFloat(price);
    orderCost = parseFloat(orderCost);
    leverage = parseFloat(leverage);

    if (buyorsell == "buy") {
      return (orderCost * leverage) / (price * (0.0012 * leverage + 0.9994));
    } else if (buyorsell == "sell") {
      return (orderCost * leverage) / (price * (0.0012 * leverage + 1.0006));
    }
    return 0;
  } catch (err) {
    return 0;
  }
};

export const orderQty = ({ price, orderValue, leverage }) => {
  try {
    price = parseFloat(price);
    orderValue = parseFloat(orderValue);
    leverage = parseFloat(leverage);
    return (orderValue * leverage) / price;
  } catch (err) {
    return 0;
  }
};

export const orderVolume = ({ price, quantity }) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    return price * quantity;
  } catch (err) {
    return 0;
  }
};

export const initialMargin = ({ price, quantity, leverage }) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    leverage = parseFloat(leverage);
    return (price * quantity) / leverage;
  } catch (err) {
    return 0;
  }
};
export const inverseIM = ({ price, quantity, leverage }) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    leverage = parseFloat(leverage);

    return (quantity / price) / leverage;
  } catch (err) {
    return 0;
  }
};

export const feeToOpen = ({ price, quantity, takerFee }) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    takerFee = parseFloat(takerFee);

    return quantity * price * (takerFee / 100);
  } catch (err) {
    return 0;
  }
};

export const feeToClose = ({
  price,
  quantity,
  leverage,
  takerFee,
  buyorsell,
}) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    takerFee = parseFloat(takerFee);
    return (
      quantity * bankrupty({ price, leverage, buyorsell }) * (takerFee / 100)
    );
  } catch (err) {
    return 0;
  }
};

export const bankrupty = ({ price, leverage, buyorsell }) => {
  try {
    price = parseFloat(price);
    if (buyorsell == "buy") {
      return price * ((leverage - 1) / leverage);
    } else if (buyorsell == "sell") {
      // return price * ((leverage - 1) / leverage);
      return price * ((leverage + 1) / leverage)
    }
    return 0;
  } catch (err) {
    return 0;
  }
};

export const liquidation = ({
  buyorsell,
  price,
  leverage,
  maintenanceMargin,
}) => {
  let liqPrice = 0;
  price = parseFloat(price);
  leverage = parseFloat(leverage);
  maintenanceMargin = parseFloat(maintenanceMargin);

  if (buyorsell == "buy") {
    liqPrice = price * (1 - 1 / leverage + maintenanceMargin / 100);
  } else if (buyorsell == "sell") {
    liqPrice = price * (1 + 1 / leverage - maintenanceMargin / 100);
  }
  return liqPrice;
};

export const positionMargin = (
  { price, quantity, leverage, takerFee, buyorsell },
  withFee = true
) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    leverage = parseFloat(leverage);
    takerFee = parseFloat(takerFee);
    if (withFee) {
      return (
        initialMargin({ price, quantity, leverage }) +
        feeToClose({ price, quantity, leverage, takerFee, buyorsell })
      );
    }
    return initialMargin({ price, quantity, leverage });
  } catch (err) {
    return 0;
  }
};

export const unrealizedPnL = ({
  entryPrice,
  quantity,
  lastPrice,
  buyorsell,
}) => {
  try {
    entryPrice = parseFloat(entryPrice);
    quantity = parseFloat(quantity);
    lastPrice = parseFloat(lastPrice);
    if (buyorsell == "buy") {
      return quantity * (lastPrice - entryPrice);
    } else if (buyorsell == "sell") {
      return quantity * (entryPrice - lastPrice);
    }
  } catch (err) {
    return 0;
  }
};

export const unrealizedPnlInvers = ({
  entryPrice,
  quantity,
  lastPrice,
  buyorsell,
}) => {
  try {
    entryPrice = parseFloat(entryPrice);
    quantity = parseFloat(quantity);
    lastPrice = parseFloat(lastPrice);
    console.log(
      lastPrice,
      "-----203",
      (1 / lastPrice - 1 / entryPrice) * quantity
    );
    if (buyorsell == "buy") {
      return (1 / entryPrice - 1 / lastPrice) * quantity;
    } else if (buyorsell == "sell") {
      return (1 / lastPrice - 1 / entryPrice) * quantity;
    }
  } catch (err) {
    return 0;
  }
};

export const unrealizedPnLPerc = ({
  entryPrice,
  quantity,
  lastPrice,
  leverage,
  takerFee,
  buyorsell,
}) => {
  try {
    entryPrice = parseFloat(entryPrice);
    quantity = parseFloat(quantity);
    lastPrice = parseFloat(lastPrice);
    leverage = parseFloat(leverage);
    takerFee = parseFloat(takerFee);

    return (
      (unrealizedPnL({ entryPrice, quantity, lastPrice, buyorsell }) /
        positionMargin({
          price: entryPrice,
          quantity,
          leverage,
          takerFee,
          buyorsell,
        })) *
      100
    );
  } catch (err) {
    return 0;
  }
};
export const positionPnL = ({ quantity, entryPrice, lastPrice }) => {
  entryPrice = parseFloat(entryPrice);
  quantity = parseFloat(quantity);
  lastPrice = parseFloat(lastPrice);
  return quantity * (entryPrice - lastPrice);
};

// export const realizedPnL = ({
//   entryPrice,
//   lastPrice,
//   quantity,
//   leverage,
//   takerFee,
//   buyorsell,
// }) => {
//   try {
//     let price = parseFloat(entryPrice);
//     quantity = parseFloat(quantity);
//     lastPrice = parseFloat(lastPrice);
//     if (buyorsell == "buy") {
//       return (
//         quantity * (lastPrice - price) -
//         (feeToOpen({ price, quantity, takerFee }) +
//           feeToClose({ price, quantity, leverage, takerFee, buyorsell }))
//       );
//     } else if (buyorsell == "sell") {
//       return (
//         quantity * (price - lastPrice) -
//         (feeToOpen({ price, quantity, takerFee }) +
//           feeToClose({ price, quantity, leverage, takerFee, buyorsell }))
//       );
//     }
//   } catch (err) {
//     return 0;
//   }
// };
export const feeTCReal = ({ price, quantity, takerFee }) => {
  try {
    price = parseFloat(price);
    quantity = parseFloat(quantity);
    takerFee = parseFloat(takerFee);

    return quantity * price * (takerFee / 100);
  } catch (err) {
    return 0;
  }
};
export const realizedPnL = ({
  entryPrice,
  exitPrice,
  quantity,
  side,
  takerFee,
}) => {
  try {
    entryPrice = parseFloat(entryPrice);
    exitPrice = parseFloat(exitPrice);
    quantity = parseFloat(quantity);
    takerFee = parseFloat(takerFee);
    if (entryPrice > 0 && exitPrice > 0 && quantity > 0) {
      let pAndL = 0;
      if (side == "buy") {
        pAndL = quantity * (exitPrice - entryPrice);
      } else if (side == "sell") {
        pAndL = quantity * (entryPrice - exitPrice);
      }
      let openFee = feeToOpen({
        price: entryPrice,
        quantity: quantity,
        takerFee: takerFee,
      });
      let closeFee = feeTCReal({
        price: exitPrice,
        quantity: quantity,
        takerFee: takerFee,
      });
      console.log(openFee, "--------openFee", takerFee);
      console.log(closeFee, "--------closeFee");
      console.log(pAndL, "--------pAndL");
      let tradeFee = openFee + closeFee;
      pAndL = pAndL + -tradeFee;
      console.log(pAndL, "--------326");
      return pAndL;
    }
    return 0;
  } catch (err) {
    console.log(err, "-----299");
    return 0;
  }
};
