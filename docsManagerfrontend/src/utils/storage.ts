const TOKEN_KEY = 'auth_token';


export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};


export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};


export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};


export const hasToken = (): boolean => {
  return getToken() !== null;
};
