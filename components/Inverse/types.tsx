export type CancelFormValues = {
    type: string;
    show: boolean;
}
export type allCheck = {
    check: boolean;
    oCheck: boolean;
    pnlCheck: boolean;
}
export type LimitFormValues = {
    price: any;
    quantity: any;
    leverage: any,
    takeProfit: any,
    orderCost: any,
    stopLoss: any,
    typeTIF: any,
}
export type MarketFormValues = {
    pairId: any,
    quantity: any;
    leverage: any,
    takeProfit: any,
    orderCost: any,
    stopLoss: any,
    action: any,
}
export type OpenOrderFormValues = {
    currentPage: Number,
    nextPage: boolean,
    limit: number,
    count: number,
    data: any
}

export type closeFormValues = {
    quantity: any,
    price: any,
    orderType: String
}