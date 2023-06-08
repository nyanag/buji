// content_script.js

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
      var productInfoItems = productIntroDescriptionTable.querySelectorAll("li");
  
      // For each product info item...
      for (var i = 0; i < productInfoItems.length; i++) {
        // Get the text of the product info item
        var productInfoItemText = productInfoItems[i].innerText;
  
        // Add the text to the product info text
        productInfoText += productInfoItemText + "\n";
      }
    }
  
    // Return the product info text
    return productInfoText;
  }
  
  var websiteName = extractWebsiteName(window.location.href);
  var productInfo = extractProductInfo();
  
  console.log("Website Name: ", websiteName);
  console.log("Product Info: ", productInfo);
  