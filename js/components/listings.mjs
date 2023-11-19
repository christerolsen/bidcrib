import getCurrentPage from "../handlers/pageDetector.mjs";
import { apiListings, baseURL } from "./settings.mjs";
import displayMessage from "./displayMessage.mjs";
import { formatDateTime } from "../utils/formatDateTime.mjs";
import { checkIfUserSignedIn } from "../auth/authorization.mjs";

const loadMoreButton = document.querySelector("#loadMoreButton");
const messageContainer = document.querySelector(".message-container");

if (messageContainer) {
  messageContainer.style.display = "flex";
}
export async function getListings() {
  try {
    const response = await fetch(apiListings);
    const results = await response.json();

    const listingsContainer = document.querySelector("#listingsContainer");

    messageContainer.style.display = "none";
    listingsContainer.innerHTML = "";

    results.forEach(function (listing) {
      const imageUrl =
        listing.media.length > 0
          ? listing.media[0]
          : "../img/various/no_image_uploaded.jpg";
      const formattedDeadline = formatDateTime(listing.endsAt);
      const formattedUpdateDate = formatDateTime(listing.updated);

      const deadlineDate = new Date(formattedDeadline);
      const currentDate = new Date();

      checkIfUserSignedIn();

      const cardHTML = `
        <div class="col">
            <div class="card " style="width: 19rem;">
                <img src="${imageUrl}" class="card-img-top" alt="Image of listing" />
                <div class="card-body">
                    <h2 class="card-title">${listing.title}</h2>
                    <p class="card-text">
                        ${listing.description}
                    </p>
                    <ul class="list-group list-group-flush"">
                        <li class="list-group-item">
                            <h5>Deadline:</h5>
                            <p>${formattedDeadline}</p>
                        </li>
                        <li class="list-group-item">
                            <h5>Updated:</h5>
                            <p>${formattedUpdateDate}</p>
                        </li>
                        
                        <li class="list-group-item signedIn" >
                            <a href="/pages/listingDetails.html?id=${listing.id}" class="card-link">View more</a>
                        </li>
                        
                        <li class="list-group-item notSignedIn" >
                            <p>Please sign in to view details</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;

      listingsContainer.innerHTML += cardHTML;

      const currentCard = listingsContainer.lastElementChild; // Get the last added card
      const title = currentCard.querySelector("h2.card-title");

      if (!(deadlineDate > currentDate)) {
        const passedDeadlineP = document.createElement("p");
        passedDeadlineP.textContent = "Deadline is passed!";
        passedDeadlineP.style.color = "red";
        passedDeadlineP.style.padding = "20px";

        title.appendChild(passedDeadlineP);
      }
    });

    //console.log(results);
  } catch (error) {
    console.error("Error fetching listings:", error);
    messageContainer.style.display = "flex";
    displayMessage("error", "Error fetching listing.", ".message-container");
  }
}
