export const format = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] == null || obj[key] === NaN || (typeof obj[key] == 'string' && obj[key].trim().length == 0)) {
            delete obj[key];
        }
    });
};