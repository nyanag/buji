// main.js

// Import the Cohere SDK to interact with the Cohere API
import { CohereClient } from 'cohere-sdk';

// Define the access token for the Cohere API
const accessToken = 'Hyw4gR2t74GYGEnz02jtxPGXWGyDOwXRVa6hzbJ7';

// Initialize the Cohere client with the access token
const cohereClient = new CohereClient(accessToken);

// Execute a script in the context of the current tab
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  var currentTab = tabs[0];
  chrome.scripting.executeScript(
    {
      target: { tabId: currentTab.id },
      files: ['content_script.js']
    },
    (injectionResults) => {
      for (const frameResult of injectionResults) {
        console.log(`We injected content_script.js into frame ${frameResult.frameId}`);
      }
    }
  );
});

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

      console.log("Score: ", score);
      console.log("Summary: ", summary);
    })
    .catch(error => {
      // If an error occurred while querying Cohere, log the error
      console.error('Error querying Cohere:', error);
    });
}