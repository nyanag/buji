// Import the Cohere SDK and authenticate it with your API access token
import { CohereClient } from 'cohere-sdk';

const accessToken = 'Hyw4gR2t74GYGEnz02jtxPGXWGyDOwXRVa6hzbJ7';
const cohereClient = new CohereClient(accessToken);

document.addEventListener("DOMContentLoaded", function() {
  // Get the current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
    var currentUrl = currentTab.url;

    // Extract the website name from the URL
    var websiteName = extractWebsiteName(currentUrl);

    // Display the website name in the popup
    var websiteNameElement = document.getElementById("websiteName");
    websiteNameElement.textContent = "Website: " + websiteName;

    // Extract and display the product information
    chrome.tabs.executeScript(
      currentTab.id,
      { code: `(${extractProductInfo.toString()})()` },
      function(results) {
        var productInfo = results[0];
        var productInfoElement = document.getElementById("productInfo");
        productInfoElement.textContent = productInfo;

        // Build the prompt for Cohere
        const prompt = `You are a friendly and knowledgeable environmentally conscientious shopper in the US. Your mission is to give advice to users about their chosen fashion item, which has the following properties:\n${productInfo}\nBased on that information, rank from a scale of 0 to 10 (0 being the worst) for water usage and energy consumption during the production process. Create an aggregated, overall ranking of the product for its sustainability concerns. Please provide this information in the format "Score: X --- Summary: ...". In a second paragraph, summarize the key reasons why this is important and what the impacts of buying this fashion item are.`;

        // Query Cohere with the prompt
        queryCohere(prompt);
      }
    );
  });

  // Function to extract the website name from the URL
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

    // Remove www.
    if (hostname.indexOf('www.') > -1) {
      hostname = hostname.split('www.')[1];
    }

    return hostname;
  }

  // Content script function to extract the product information
  function extractProductInfo() {
    var productIntroDescriptionTable = document.querySelector(".product-intro__description-table");
    var productInfoText = "";

    if (productIntroDescriptionTable) {
      var productInfoItems = productIntroDescriptionTable.querySelectorAll(".product-intro__description-table-item");

      productInfoItems.forEach(function(item) {
        var keyElement = item.querySelector(".key");
        var valElement = item.querySelector(".val");

        if (keyElement && valElement) {
          var keyText = keyElement.textContent.trim();
          var valText = valElement.textContent.trim();
          productInfoText += keyText + ": " + valText + "\n";
        }
      });
    }

    return productInfoText;
  }

  function queryCohere(query) {
    cohereClient.completions.createCompletion(query)
      .then(response => {
        const { choices } = response.data;
        const completion = choices[0].text;

        // Split the completion into the score and the summary
        const parts = completion.split('---');
        const score = parts[0].trim();
        const summary = parts[1].trim();
    
        // Display the score and the summary
        var scoreElement = document.getElementById("score");
        scoreElement.textContent = score;

        var summaryElement = document.getElementById("summary");
        summaryElement.textContent = summary;
      })
      .catch(error => {
        console.error('Error querying Cohere:', error);
      });
  }
});
