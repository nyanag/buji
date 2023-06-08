// Import the Cohere SDK and authenticate it with your API access token
import { CohereClient } from 'cohere-sdk';


const accessToken = 'Hyw4gR2t74GYGEnz02jtxPGXWGyDOwXRVa6hzbJ7';
const cohereClient = new CohereClient(accessToken);

// Function to read a text file and return its contents as a string
function readFileAsString(filename) {
  return fs.readFileSync(filename, 'utf8');
}

// Read the text file as a string
const filename = './query_text.txt';
const fileContent = readFileAsString(filename);


document.addEventListener("DOMContentLoaded", function() {
  // Get the current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
  
    // Extract and display the product information
    chrome.tabs.executeScript(
      currentTab.id,
      { code: `(${extractProductInfo.toString()})()` },
      function(results) {
        var productInfo = results[0];
        var productInfoElement = document.getElementById("productInfo");
        productInfoElement.textContent = productInfo;
  

        
        // Query Cohere with the prompt
        queryCohere(pfileContentrompt);
      }
    );
  });

  function extractProductInfo() {
    // Your extractProductInfo implementation...
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
