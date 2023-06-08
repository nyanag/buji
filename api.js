// TODO: add to manifest

// Import the Cohere SDK and authenticate it with your API access token
import { CohereClient } from 'cohere-sdk';
import fs from 'fs';

const accessToken = 'Hyw4gR2t74GYGEnz02jtxPGXWGyDOwXRVa6hzbJ7';
const cohereClient = new CohereClient(accessToken);

// Function to read a text file and return its contents as a string
function readFileAsString(filename) {
  return fs.readFileSync(filename, 'utf8');
}

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

// Read the text file as a string
const filename = './query_text.txt';
const fileContent = readFileAsString(filename);

// Call the query function with the file content as the query
queryCohere(fileContent);
