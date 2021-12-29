import joinUrl from 'url-join';

export const preparePath = (base: string, params?: any, query?: any): string => {
    let url = base;
    if (params != null && typeof params == 'object') {
        url = applyParams(url, params);
    }
    if (query != null && typeof query == 'object') {
        url = applyQueryString(url, query);
    }

    return url;
}

export const applyParams = (base: string, params: any): string => {
    let url = base;
    Object.keys(params).forEach((key) => url = url.replace(`:${key}`, params[key]));
        
    return url;
}


export const applyQueryString = (base: string, query: any): string => {
    return joinUrl(base, createQueryString(query));
}

export const createQueryString = (query: any): string => {
    const items = Object.keys(query).map((key) => `${key}=${query[key]}`);

    return items.length > 0 ? `?${items.join('&')}` : '';
}