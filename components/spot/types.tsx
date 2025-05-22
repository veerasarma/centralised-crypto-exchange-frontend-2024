export type LimitFormValues = {
    price: any;
    quantity: any;
    slidQuant: any;
    total: any;
    percentage: any;
}
export type MarketFormValues = {
    orderValue?: any;
    amount?: any;
    slidQuant?: any;
    percentage: any;
}
export type OpenOrderFormValues = {
    currentPage: Number,
    nextPage: boolean,
    limit: number,
    count: number,
    data: any
}