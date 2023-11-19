import { apiProfiles } from "../components/settings.mjs";
import { getFromLocalStorage } from "../utils/storage.mjs";
import displayMessage from "../components/displayMessage.mjs";

export const profileContent = document.querySelector("#profile-section");
const messageContainer = document.querySelector(".message-container");

const token = getFromLocalStorage("tokenKey");
const name = getFromLocalStorage("userKey");

const options = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

function handleFetchError(error) {
  console.error("Error fetching data:", error);
  messageContainer.style.display = "flex";
  displayMessage("error", "Error fetching data.", ".message-container");
  profileContent.style.display = "none";
}

// Get the User info:
export async function getUserProfile() {
  const userAvatar = document.querySelector("#userAvatar");
  const userName = document.querySelector("#userName");
  const userEmail = document.querySelector("#userEmail");
  const userCredits = document.querySelector("#userCredits");
  const userWins = document.querySelector("#userWins");
  const userListingsCount = document.querySelector("#userListingsCount");

  try {
    const response = await fetch(`${apiProfiles}/${name}`, options);

    if (!response.ok) {
      // If the response status is not ok (e.g., 404 Not Found), throw an error
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const profileData = await response.json();

    //console.log(profileData);

    userAvatar.innerHTML = `<img class="img-fluid" style="width: 100%; padding: 1em;" src="${profileData.avatar}" alt"${profileData.name}'s avatar" />`;
    userName.innerHTML = profileData.name;
    userEmail.innerHTML = profileData.email;
    userCredits.innerHTML = profileData.credits;
    userWins.innerHTML = profileData.wins.length;
    userListingsCount.innerHTML = profileData._count.listings;

    //
  } catch (error) {
    handleFetchError(error);
  }
}

// Delete a user listing:
export async function deleteUserListing(listingId) {
  try {
    const response = await fetch(
      `${apiProfiles}/${name}/listings/${listingId}`,
      {
        method: "DELETE",
        options,
        // You can include headers or other options as needed
      }
    );

    if (!response.ok) {
      // If the response status is not ok (e.g., 404 Not Found), throw an error
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log(`Listing with ID ${listingId} deleted successfully`);
  } catch (error) {
    handleFetchError(error);
  }
}

// Get the user listings
export async function getUserListings() {
  try {
    const response = await fetch(`${apiProfiles}/${name}/listings`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const userListingsData = await response.json();

    if (!userListingsData.length) {
      const userListings = document.querySelector("#userListings");
      userListings.innerHTML = "";
    } else {
      const userListings = document.querySelector("#userListings");
      const listingsArray = userListingsData;

      listingsArray.forEach((listing) => {
        userListings.innerHTML += `<li class="list-group-item">
          <a href="/pages/listingDetails.html?id=${listing.id}" class="card-link">${listing.title}</a>
          <button style="all: unset; cursor: pointer;" onclick="deleteListing(${listing.id})"><span class="material-symbols-outlined">
          delete
          </span>
          </button>
        </li>`;
      });
    }
  } catch (error) {
    handleFetchError(error);
  }
}

// Function to handle the deletion of a listing
async function deleteListing(listingId) {
  try {
    await deleteUserListing(listingId);
    // Optionally, you can refresh the user listings after deletion
    await getUserListings();
  } catch (error) {
    handleFetchError(error);
  }
}

if (profileContent) {
  profileContent.innerHTML = `
        
        
        
        
              <div class="container justify-content-center notSignedIn">
                  <div class="card text-center">
                      <div class="card-header"></div>
                      <div class="card-body">
                          <h5 class="card-title">You must be logged in to view this content</h5>
                          <a href="/pages/signin.html" class="card-link">Sign in here</a>
                      </div>
                      <div class="card-footer text-body-secondary"></div>
                  </div>
              </div>
      
              <div class="container signedIn">
                <div class="row">
                <h1>Profile</h1>
                  <div class="card mb-3" style="max-width: 540px; margin-bottom: 10%;">
                      <div class="row g-0">
                          <div id="userAvatar" class="col-md-4">
                          </div>
                          <div class="col-md-8">
                              <div class="card-body">
                                  <h3 id="userName"></h3>
                                  <h5>Email: <span id="userEmail"></span></h5>
                                  <h5>Credits: <span id="userCredits"></span></h5>
                                  <h5>Wins: <span id="userWins"></span></h5>
                              </div
                          </div>
                      </div>
                      <div class="card-footer text-body-secondary row align-items-center">
                        <div class="col">
                      <input
                      id="updateAvatar"
                      type="url"
                      name="avatar"
                      class="form-control"
                      placeholder="Paste URL for new Avatar"
                      aria-label="Avatar"
                      />
                        </div>
                        <div class="col">
                        <button id="updateButton" class="btn" onclick="updateAvatar()">Update</button>
                        </div>
                      </div>
                  </div>
                </div>
                <div class="row">
                    <h2>Your listings</h2>
                    <h5>Number of listings: <span id="userListingsCount"></span></h5>
                </div>
                <div class="row">
                    <div class="card" style="width: 18rem;">
                        <ul id="userListings" class="list-group list-group-flush">
                        </ul>
                    </div>
                </div>
              </div>
          `;
}

export async function updateAvatar() {
  const avatarInput = document.querySelector("#updateAvatar");
  const avatarValue = avatarInput.value.trim();

  let validationErrors = [];
  // Check for valid avatar URL format
  if (!/\.(jpg|jpeg|png|gif|svg)$/i.test(avatarValue)) {
    validationErrors.push(
      "Avatar must be a valid URL ending with .jpg, .jpeg, .png, .gif, or .svg."
    );
  }

  if (validationErrors.length > 0) {
    // Handle validation errors, e.g., display error messages to the user
    const errorMessage = "Validation errors:\n" + validationErrors.join("\n");
    alert(errorMessage);
    return;
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatar: avatarValue }),
  };

  const apiUrl = `${apiProfiles}/${name}/media`;

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      // If the response status is not ok (e.g., 404 Not Found), throw an error
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    window.location.href = "/pages/profile.html";

    // Handle profileData as needed
  } catch (error) {
    handleFetchError(error);
  }
}

// Set the event listener outside the updateAvatar function
const updateButton = document.querySelector("#updateButton");
if (updateButton) {
  updateButton.addEventListener("click", updateAvatar);
}
