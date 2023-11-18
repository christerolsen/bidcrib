import getCurrentPage from "./handlers/pageDetector.mjs";
import { getListings } from "./components/listings.mjs";
import { submitRegisterForm } from "./auth/register.mjs";
import { submitSigninForm } from "./auth/signin.mjs";
import { getFromLocalStorage } from "./utils/storage.mjs";
import { checkIfUserSignedIn } from "./auth/authorization.mjs";
import {
  profileContent,
  getUserProfile,
  getUserListings,
} from "./auth/profile.mjs";
import { getListingDetails } from "./components/listingDetails.mjs";
import { addSignOutClickListener } from "./auth/signout.mjs";

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
    if (profileContent) {
      getUserProfile();
      getUserListings();
    }
    break;

  case "about":
    // Code for the about page
    break;

  case "listingDetails":
    getListingDetails();
    break;

  default:
    // Code for an unknown or default case
    break;
}

checkIfUserSignedIn();
addSignOutClickListener();
