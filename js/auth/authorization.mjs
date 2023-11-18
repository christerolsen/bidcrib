import { getFromLocalStorage } from "../utils/storage.mjs";

export function checkIfUserSignedIn() {
  const notSignedInElements = document.querySelectorAll(".notSignedIn");
  const signedInElements = document.querySelectorAll(".signedIn");

  const token = getFromLocalStorage("tokenKey");

  notSignedInElements.forEach((element) => {
    //console.log("setting for NOT", element);
    element.style.display = token ? "none" : "flex";
  });

  signedInElements.forEach((element) => {
    //console.log("setting for YES", element);
    element.style.display = token ? "flex" : "none";
  });
}

/**
 * const options = {
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....',
  },
}
 
const response = await fetch(`${API_BASE_URL}/auction/listings`, options)
const data = await response.json()
 */
