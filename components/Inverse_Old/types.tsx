export type LimitFormValues = {
    price: any;
    quantity: any;
    leverage: any,
    takeProfit: any,
    stopLoss: any,
    typeTIF: any,
}
export type MarketFormValues = {
    pairId: any,
    quantity: any;
    leverage: any,
    takeProfit: any,
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