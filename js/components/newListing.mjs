console.log("start");

import { getFromLocalStorage } from "../utils/storage.mjs";
import { apiListings } from "./settings.mjs";

import displayMessage from "../components/displayMessage.mjs";

document
  .querySelector("#createListingButton")
  .addEventListener("click", createListing);

const token = getFromLocalStorage("tokenKey");

const messageContainer = document.querySelector(".message-container");

const titleValue = document.querySelector("#listingTitle").value;
const deadlineValue = document.querySelector("#listingDeadline").value;
const mediaValue = document.querySelector("#listingMedia").value.split(", ");
const descriptionValue = document.querySelector("#listingDescription").value;

if (createListingButton) {
  createListingButton.addEventListener("click", submitRegisterForm);
}

function submitRegisterForm(event) {
  event.preventDefault();

  let validationErrors = [];

  // check for empty required fields
  if (!titleValue || !deadlineValue || !mediaValue || !descriptionValue) {
    validationErrors.push(
      "All fields are required. Please fill in all the fields."
    );
  }

  // check for valid title length
  if (titleValue.length < 10 || titleValue.length > 50) {
    validationErrors.push("Title must be between 100 and 50 characters.");
  }

  // check for valid avatar URL format
  if (!/\.(jpg|jpeg|png|gif|svg)$/i.test(mediaValue)) {
    validationErrors.push(
      "Avatar must be a valid URL ending with .jpg, .jpeg, .png, .gif, or .svg."
    );
  }

  // Display validation errors if any
  if (validationErrors.length > 0) {
    messageContainer.style.display = "flex";
    displayMessage(
      "error",
      validationErrors.join("<br><br>"),
      ".message-container"
    );
    return;
  }

  // If no validation errors, proceed with registration
  registerUser(nameValue, emailValue, passwordValue, avatarValue);
}

async function createListing() {
  const title = document.querySelector("#listingTitle").value;
  const deadline = document.querySelector("#listingDeadline").value;
  const media = document.querySelector("#listingMedia").value.split(", ");
  const description = document.querySelector("#listingDescription").value;

  const data = {
    title,
    description,
    endsAt: deadline,
    tags: [], // You can add tags if needed
    media,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiListings}`, options);

    if (response.ok) {
      window.location.href = "/pages/profile.html";
    } else {
      const responseData = await response.json();

      console.log(response, responseData);
    }
  } catch (error) {
    console.error("Error creating listing:", error);
  }
}
