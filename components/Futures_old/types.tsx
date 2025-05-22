export type LimitFormValues = {
    price: any;
    quantity: any;
    leverage: any,
    takeProfit: any,
    stopLoss: any,
    typeTIF: any,
}
export type CancelFormValues = {
    type: string;
    show: boolean;
}
export type MarketFormValues = {
    pairId: any,
    quantity: any;
    leverage: any,
    takeProfit: any,
    stopLoss: any,
    action: any,
}
export type closeFormValues = {
    quantity: any,
    price: any,
    orderType: String
}
export type OpenOrderFormValues = {
    currentPage: Number,
    nextPage: boolean,
    limit: number,
    count: number,
    data: any
}