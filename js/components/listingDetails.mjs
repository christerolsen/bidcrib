import { apiListings } from "./settings.mjs";
import { formatDateTime } from "../utils/formatDateTime.mjs";
import { getFromLocalStorage } from "../utils/storage.mjs";
import displayMessage from "./displayMessage.mjs";

const metaDescription = document.querySelector('meta[name="description"]');
const pageTitle = document.title;

export async function getListingDetails(listingId) {
  try {
    const response = await fetch(`${apiListings}/${listingId}`);
    const listing = await response.json();

    metaDescription.content = listing.description;
    document.title = `BidCrib | ${listing.title}`;

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

      const deadlineDate = new Date(formattedDeadline);
      const currentDate = new Date();

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
              </ul>
              <div class="card-footer text-body-secondary">
                <form id="bidForm">
                  <div class="form-group d-flex gap-10">
                    <input type="number" class="form-control" style="max-width: fit-content; margin-right: 10px;" id="bidAmount" placeholder="Make your bid" required>
                    <button type="submit" class="btn btn-primary">Bid</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;

      if (!(deadlineDate > currentDate)) {
        const passedDeadlineP = document.createElement("p");
        passedDeadlineP.textContent = "Deadline is passed!";
        passedDeadlineP.style.color = "red";
        passedDeadlineP.style.padding = "20px";

        const title = document.querySelector(".card-title");
        title.appendChild(passedDeadlineP);

        const cardFooter = document.querySelector(".card-footer");
        cardFooter.style.display = "none";
      }

      const bidForm = document.querySelector("#bidForm");

      bidForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const bidAmount = parseFloat(
          document.querySelector("#bidAmount").value
        );
        const token = getFromLocalStorage("tokenKey");

        try {
          const bidResponse = await fetch(`${apiListings}/${listingId}/bids`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: bidAmount,
            }),
          });

          if (bidResponse.ok) {
            alert("Bid placed successfully!");
            location.reload();
          } else {
            const errorData = await bidResponse.json();
            const errorMessage =
              errorData.errors && errorData.errors.length > 0
                ? errorData.errors[0].message
                : "Unknown error";

            console.log(errorData);
            console.log(`Error message: ${errorMessage}`);

            alert(`Error placing bid: ${errorMessage}`);
          }

          const bidData = await bidResponse.json();
          console.log("Bid placed successfully:", bidData);
          // Du kan legge til logikk her for å oppdatere grensesnittet eller gi tilbakemelding til brukeren.
        } catch (error) {
          console.error("Error placing bid:", error);
        }
      });
    })
    .catch((error) => {
      console.error("Error getting listing details:", error);
    });
}
