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
});
