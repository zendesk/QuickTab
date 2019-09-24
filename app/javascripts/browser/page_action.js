var pageAction = {
  show: function(tabId) {
    chrome.pageAction.show(tabId);
  },

  setIcon: function(option) {
    var icon = '/images/icons/icon38-' + option + '.png';

    chrome.tabs.query({ url: '*://*.zendesk.com/agent/*' }, function(openTabs) {
      openTabs.forEach(function(tab) {
        chrome.pageAction.setIcon({ tabId: tab.id, path: icon });
      });
    });
  }
};

module.exports = pageAction;
