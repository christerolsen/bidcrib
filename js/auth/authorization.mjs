import { getFromLocalStorage } from "../utils/storage.mjs";

export function headers() {
  const token = getFromLocalStorage("tokenKey");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log(token);
}

headers();
