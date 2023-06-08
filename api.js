// TODO: add to manifest

// Import the Cohere SDK and authenticate it with your API access token
import { CohereClient } from 'cohere-sdk';

const accessToken = 'Hyw4gR2t74GYGEnz02jtxPGXWGyDOwXRVa6hzbJ7';
const cohereClient = new CohereClient(accessToken);

// Function to handle the query
async function queryCohere(query) {
  try {
    // Send the query to the Cohere API
    const response = await cohereClient.completions.createCompletion(query);
    const { choices } = response.data;
    
    // Access the generated completion
    const completion = choices[0].text;
    
    // Process and use the generated completion as needed
    console.log(completion);
  } catch (error) {
    console.error('Error querying Cohere:', error);
  }
}

// Call the query function with your desired query
String queryText = 'Using the item composition and based on that information, rank from a scale of 0 to 10 (0 being the worst) for water usage and energy consumption during the production process';
queryCohere(queryText);
