const TokenKey: string = process.env.REACT_APP_TOKEN_KEY ?? 'token';

export const TokenType = process.env.REACT_APP_TOKEN_TYPE ?? 'Bearer';

export const RefreshTokenUrl = process.env.REACT_APP_REFRESH_TOKEN_URL ?? '';

export const getAccessToken: () => string | null = () => localStorage.getItem(TokenKey);

export const saveAccessToken = (token: string) => localStorage.getItem(TokenKey);

export const clearAccessToken = () => localStorage.removeItem(TokenKey);
