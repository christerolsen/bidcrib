import getCurrentPage from "../handlers/pageDetector.mjs";
import { apiListings, baseURL } from "./settings.mjs";
import displayMessage from "./displayMessage.mjs";
import { formatDateTime } from "../utils/formatDateTime.mjs";

const loadMoreButton = document.querySelector("#loadMoreButton");
const messageContainer = document.querySelector(".message-container");

//loadMoreButton.style.display = "block";

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
          : "../img/various/mountain2.jpg";
      const formattedDeadline = formatDateTime(listing.endsAt);
      const formattedUpdateDate = formatDateTime(listing.updated);

      listingsContainer.innerHTML += `
        <div class="col">
            <div class="card h-100" style="width: 19rem;">
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
                        
                        <li class="list-group-item">
                            <a href="#" class="card-link">View more</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;
      //husk å endre <ul>-ene i forhold til om man er innlogget eller utlogget. Det som vises nå er for innlogget.
    });

    console.log(results);
  } catch (error) {
    console.error("Error fetching listings:", error);
    messageContainer.style.display = "flex";
    displayMessage("error", "Error fetching listing.", ".message-container");
  }
}
