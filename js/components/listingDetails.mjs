import { apiListings } from "./settings.mjs";
import { formatDateTime } from "../utils/formatDateTime.mjs";

export async function getListingDetails(listingId) {
  try {
    const response = await fetch(`${apiListings}/${listingId}`);
    const listing = await response.json();

    return listing;
  } catch (error) {
    console.error("Error fetching listing details:", error);

    const messageContainer = document.querySelector(".message-container");
    messageContainer.style.display = "flex";
    displayMessage(
      "error",
      "Error fetching listing details.",
      ".message-container"
    );

    throw error;
  }
}

const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

if (listingId) {
  getListingDetails(listingId)
    .then((listing) => {
      const listingDetailsSection = document.querySelector(
        "#listingDetails-section"
      );
      const imageUrl =
        listing.media.length > 0
          ? listing.media[0]
          : "../img/various/no_image_uploaded.jpg";
      const formattedDeadline = formatDateTime(listing.endsAt);
      const formattedUpdateDate = formatDateTime(listing.updated);

      listingDetailsSection.innerHTML = `
      <div class="container justify-content-center">
        <div class="card "style="width: 20;">
            <img src="${imageUrl}" class="card-img-top" alt="...">
            <div class="card-body">
                <h1 class="card-title">${listing.title}</h1>
                <p class="card-text">${listing.description}</p>
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
                            <h5>Number of bids: <span>${listing._count.bids}</span></h5>
                        </li>
                        
                        <li class="list-group-item">
                            <a href="/pages/listingDetails.html?id=${listing.id}" class="card-link">View more</a>
                        </li>
                    </ul>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
        </div>
      
      
      
      
      
      `;
      console.log("Listing details:", listing);

      // Example: Populate HTML elements with listing details
      // document.getElementById("title").innerText = listing.title;
    })
    .catch((error) => {
      // Handle the error, e.g., log it or display a user-friendly message
      console.error("Error getting listing details:", error);
    });
} else {
  console.error("Listing ID not found in the URL.");
  // Handle the case where the listing ID is missing.
}
