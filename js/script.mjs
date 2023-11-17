import getCurrentPage from "./handlers/pageDetector.mjs";
import { getListings } from "./components/listings.mjs";
import { submitRegisterForm } from "./auth/register.mjs";
import { submitSigninForm } from "./auth/signin.mjs";
import { token, user, credit, avatar } from "./auth/profile.mjs";
import { getFromLocalStorage } from "./utils/storage.mjs";
import { headers } from "./auth/authorization.mjs";

const currentPage = getCurrentPage();

switch (currentPage) {
  case "index":
    const listingsContainer = document.querySelector("#listingsContainer");
    if (listingsContainer) {
      getListings();
    }
    break;

  case "register":
    const registerForm = document.querySelector("#registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", submitRegisterForm);
    }
    break;

  case "signin":
    const signinForm = document.querySelector("#signinForm");
    if (signinForm) {
      signinForm.addEventListener("submit", submitSigninForm);
    }
    break;

  case "profile":
    break;

  case "listing":
    // Code for the listing page
    break;

  case "about":
    // Code for the about page
    break;

  default:
    // Code for an unknown or default case
    break;
}

console.log(headers());
