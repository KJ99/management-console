export default (estimation?: string) => {
    const map: any = {
        S: 1,
        M: 2,
        L: 3,
        XL: 5,
        XXL: 8,
        XXXL: 13,
        XXXXL: 21
    };
    return map[estimation ?? ''] ?? 0;
}