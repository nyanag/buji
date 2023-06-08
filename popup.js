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
        }
      );
    });
  
    // Function to extract the website name from the URL
    function extractWebsiteName(url) {
      var hostname;
      // Find and remove the protocol
      if (url.indexOf("://") > -1) {
        hostname = url.split("/")[2];
      } else {
        hostname = url.split("/")[0];
      }
  
      // Find and remove port number
      hostname = hostname.split(":")[0];
  
      // Find and remove query parameters
      hostname = hostname.split("?")[0];
  
      // Find and remove www.
      if (hostname.indexOf("www.") > -1) {
        hostname = hostname.slice(4);
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
  });
  