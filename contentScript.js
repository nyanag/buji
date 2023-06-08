// This script runs in the context of the tab

// Import the Cohere SDK to interact with the Cohere API
import { CohereClient } from 'cohere-sdk';

// Define the access token for the Cohere API
const accessToken = 'Hyw4gR2t74GYGEnz02jtxPGXWGyDOwXRVa6hzbJ7';

// Initialize the Cohere client with the access token
const cohereClient = new CohereClient(accessToken);

// Function to extract the website name from a URL
function extractWebsiteName(url) {
  var hostname;

  // Find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  // Find & remove port number
  hostname = hostname.split(':')[0];

  // Find & remove "?"
  hostname = hostname.split('?')[0];

  // Remove "www."
  if (hostname.indexOf('www.') > -1) {
    hostname = hostname.split('www.')[1];
  }

  // Return the hostname
  return hostname;
}

// Function to extract product information from the current webpage
function extractProductInfo() {
  // Find the product description table
  var productIntroDescriptionTable = document.querySelector(".product-intro__description-table");

  var productInfoText = "";

  // If the product description table exists...
  if (productIntroDescriptionTable) {
    // Find all of the items in the product description table
    var productInfoItems = productIntroDescriptionTable.querySelectorAll(".product-intro__description-table-item");

    // For each item in the product description table...
    productInfoItems.forEach(function(item) {
      // Find the "key" and "val" elements
      var keyElement = item.querySelector(".key");
      var valElement = item.querySelector(".val");

      // If both the "key" and "val" elements exist...
      if (keyElement && valElement) {
        // Get the text content of the "key" and "val" elements, removing any leading/trailing whitespace
        var keyText = keyElement.textContent.trim();
        var valText = valElement.textContent.trim();

        // Add the key and value to the product info text
        productInfoText += keyText + ": " + valText + "\n";
      }
    });
  }

  // Return the product info text
  return productInfoText;
}

// Function to send a query to Cohere
function queryCohere(query) {
  // Send a "createCompletion" request to the Cohere API with the provided query
  cohereClient.completions.createCompletion(query)
    .then(response => {
      // Get the choices from the response data
      const { choices } = response.data;

      // Get the first choice (which should be the only one, since we're not specifying a "max_tokens" value)
      const completion = choices[0].text;

      // Split the completion into the score and the summary, separated by '---'
      const parts = completion.split('---');
      const score = parts[0].trim();
      const summary = parts[1].trim();

      // Find the elements with the IDs of "score" and "summary"
      var scoreElement = document.getElementById("score");
      var summaryElement = document.getElementById("summary");

      // Set the text content of the "score" and "summary" elements to the score and summary
      scoreElement.textContent = score;
      summaryElement.textContent = summary;
    })
    .catch(error => {
      // If an error occurred while querying Cohere, log the error
      console.error('Error querying Cohere:', error);
    });
}

// Add an event listener for when the document (the popup) has finished loading
document.addEventListener("DOMContentLoaded", function() {
  // Get the URL of the current tab
  var currentUrl = window.location.href;

  // Extract the website name from the URL
  var websiteName = extractWebsiteName(currentUrl);

  // Find the element with the ID of "websiteName"
  var websiteNameElement = document.getElementById("websiteName");

  // Set the text content of the "websiteName" element to the website name
  websiteNameElement.textContent = "Website: " + websiteName;

  // Extract product information from the current webpage
  var productInfo = extractProductInfo();

  // Find the element with the ID of "productInfo"
  var productInfoElement = document.getElementById("productInfo");

  // Set the text content of the "productInfo" element to the product info
  productInfoElement.textContent = productInfo;

  // Query Cohere with the product info
  queryCohere(productInfo);
});
