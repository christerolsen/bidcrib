import { getFromLocalStorage } from "../utils/storage.mjs";

export const token = getFromLocalStorage("tokenKey");
export const user = getFromLocalStorage("userKey");
export const credit = getFromLocalStorage("creditKey");
export const avatar = getFromLocalStorage("avatarKey");
