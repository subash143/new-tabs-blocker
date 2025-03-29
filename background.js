// background.js
console.log("Background script is running");

chrome.tabs.onCreated.addListener(function(tab) {
    // Check if the tab was opened from another tab
      if (tab.openerTabId) {
        chrome.tabs.get(tab.openerTabId, function(openerTab) {
          const openerUrl = new URL(openerTab.url);
          const openerHostname = openerUrl.hostname;
//          console.log("Opener hostname:", openerHostname);

          // Get the blocked websites from storage
          chrome.storage.sync.get({ blockedWebsites: [] }, function(data) {
            const blockedWebsites = data.blockedWebsites;
//            console.log("Blocked websites:", blockedWebsites);

            // Check if the opener tab's hostname contains any of the blocked substrings
            const isBlocked = blockedWebsites.some(blockedSite => openerHostname.includes(blockedSite));
            if (isBlocked) {
//              console.log("Blocking new tab from:", openerHostname);
              // Close the new tab
              chrome.tabs.remove(tab.id);
            }
          });
        });
      }
});