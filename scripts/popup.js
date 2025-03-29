document.addEventListener('DOMContentLoaded', function() {
  const addCurrentButton = document.getElementById('btnAddCurrent');
  const blockedList = document.getElementById('blockedList');
  

   // Load the blocked websites from storage and display them
   chrome.storage.sync.get({ blockedWebsites: [] }, function(data) {
    const blockedWebsites = data.blockedWebsites;
    blockedWebsites.forEach(function(website) {
      addBlockedWebsiteToList(website);
    });
  });

  // Add the current active website to the blocked list
  addCurrentButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      const activeUrl = new URL(activeTab.url);
      const activeHostname = activeUrl.hostname;

      chrome.storage.sync.get({ blockedWebsites: [] }, function(data) {
        const blockedWebsites = data.blockedWebsites;
        if (!blockedWebsites.includes(activeHostname)) {
          blockedWebsites.push(activeHostname);
          chrome.storage.sync.set({ blockedWebsites: blockedWebsites }, function() {
            addBlockedWebsiteToList(activeHostname);
          });
        }
      });
    });
  });

    // Function to add a blocked website to the list in the popup
    function addBlockedWebsiteToList(website) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = website;
  
      const deleteButton = document.createElement('span');
      deleteButton.className = 'btn btn-sm btn-danger';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
        removeBlockedWebsite(website);
        blockedList.removeChild(li);
      });
  
      li.appendChild(deleteButton);
        blockedList.appendChild(li);
    }

    // Function to remove a blocked website from storage
  function removeBlockedWebsite(website) {
    chrome.storage.sync.get({ blockedWebsites: [] }, function(data) {
      const blockedWebsites = data.blockedWebsites;
      const index = blockedWebsites.indexOf(website);
      if (index !== -1) {
        blockedWebsites.splice(index, 1);
        chrome.storage.sync.set({ blockedWebsites: blockedWebsites });
      }
    });
  }

});