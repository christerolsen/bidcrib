import { removeFromLocaleStorage } from "../utils/storage.mjs";

function signOutUser() {
  //remove all keys from local storage
  Object.keys(localStorage).forEach((key) => {
    removeFromLocaleStorage(key);
  });

  //re-direct user to signin.html
  window.location.href = "/pages/signin.html";
}

export function addSignOutClickListener() {
  //adds an event listener after page is loaded
  document.addEventListener("DOMContentLoaded", () => {
    const signOutElement = document.querySelector("#signOutLink");

    if (signOutElement) {
      signOutElement.addEventListener("click", signOutUser);
    }
  });
}
