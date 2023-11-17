//save keys
export function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

//load keys
export function getFromLocalStorage(key) {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
}

//clear keys
export function removeFromLocaleStorage(key) {
  localStorage.removeItem(key);
}
