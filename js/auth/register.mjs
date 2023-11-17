import { apiRegister } from "../components/settings.mjs";
import displayMessage from "../components/displayMessage.mjs";

const registerForm = document.querySelector("#registerForm");
const registerName = document.querySelector("#registerName");
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const confirmPassword = document.querySelector("#confirmPassword");
const registerAvatar = document.querySelector("#registerAvatar");
const registerButton = document.querySelector("#registerButton");

const messageContainer = document.querySelector(".message-container");

if (registerForm) {
  registerForm.addEventListener("submit", submitRegisterForm);
}

export function submitRegisterForm(event) {
  event.preventDefault();

  const nameValue = registerName.value.trim();
  const emailValue = registerEmail.value.trim();
  const passwordValue = registerPassword.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();
  const avatarValue = registerAvatar.value.trim();

  let validationErrors = [];

  // Check for empty required fields
  if (
    !nameValue ||
    !emailValue ||
    !passwordValue ||
    !confirmPasswordValue ||
    !avatarValue
  ) {
    validationErrors.push(
      "All fields are required. Please fill in all the fields."
    );
  }

  // Check for valid name format
  if (!/^[a-zA-Z0-9_.-]+$/.test(nameValue)) {
    validationErrors.push(
      "Name can only contain letters, numbers, periods, underscores, and hyphens."
    );
  }

  // Check for valid email format
  if (!/^[\w.-]+@stud\.noroff\.no$/.test(emailValue)) {
    validationErrors.push(
      "Only emails with @stud.noroff.no domain are allowed."
    );
  }

  // Check for valid password format
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      passwordValue
    )
  ) {
    validationErrors.push(
      "Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."
    );
  }

  // Check for valid avatar URL format
  if (!/\.(jpg|jpeg|png|gif|svg)$/i.test(avatarValue)) {
    validationErrors.push(
      "Avatar must be a valid URL ending with .jpg, .jpeg, .png, .gif, or .svg."
    );
  }

  // Check if passwords match
  if (passwordValue !== confirmPasswordValue) {
    validationErrors.push("Passwords do not match.");
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

export async function registerUser(
  nameValue,
  emailValue,
  passwordValue,
  avatarValue
) {
  const data = JSON.stringify({
    name: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value,
    avatar: registerAvatar.value,
  });

  console.log(data);

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(apiRegister, options);
    const json = await response.json();

    if (response.ok) {
      displayMessage("success", "Success!", ".message-container");

      setTimeout(() => {
        window.location.href = "signin.html";
      }, 2000);
    }

    if (json.error) {
      displayMessage("error", json.error.message, ".message-container");
    }
  } catch (error) {
    console.error("Registration error:", error);
    messageContainer.style.display = "flex";
    displayMessage(
      "error",
      "An error occurred during registration. Please try again.",
      ".message-container"
    );
  }
}
