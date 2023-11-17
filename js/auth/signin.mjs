import { apiLogin } from "../components/settings.mjs";
import displayMessage from "../components/displayMessage.mjs";
import { saveToLocalStorage } from "../utils/storage.mjs";

const signinForm = document.querySelector("#signinForm");
const signinEmail = document.querySelector("#signinEmail");
const signinPassword = document.querySelector("#signinPassword");
const signinButton = document.querySelector("#signinButton");

const messageContainer = document.querySelector(".message-container");

if (signinForm) {
  signinForm.addEventListener("submit", submitSigninForm);
}

export function submitSigninForm(event) {
  event.preventDefault();

  const emailValue = signinEmail.value.trim();
  const passwordValue = signinPassword.value.trim();

  if (!emailValue || !passwordValue) {
    messageContainer.style.display = "flex";
    displayMessage(
      "error",
      "All fields are required. Please fill in all the fields.",
      ".message-container"
    );
    return;
  }

  signinUser(emailValue, passwordValue);
}

export async function signinUser(emailValue, passwordValue) {
  const data = JSON.stringify({
    email: signinEmail.value,
    password: signinPassword.value,
  });

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(apiLogin, options);
    const json = await response.json();

    if (response.ok) {
      // save keys for localStorage after successful sign in
      saveToLocalStorage("tokenKey", json.accessToken);
      saveToLocalStorage("userKey", json.name);
      saveToLocalStorage("creditKey", json.credits);
      saveToLocalStorage("avatarKey", json.avatar);

      displayMessage("success", "Success!", ".message-container");
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 2000);
    }

    if (json.errors) {
      displayMessage("error", json.errors[0].message, ".message-container");
    }
  } catch (error) {
    console.error("Sign in error:", error);
    messageContainer.style.display = "flex";
    displayMessage(
      "error",
      "An error occurred during sign in. Please try again.",
      ".message-container"
    );
  }
}
