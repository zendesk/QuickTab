var tabs = {
  remove: function(tabId) {
    chrome.tabs.remove(tabId);
  },

  create: function(url) {
    chrome.tabs.create({ url: url });
  },

  focus: function(tab) {
    var tabId    = tab.id,
        windowId = tab.windowId;

    chrome.tabs.update(tabId, { active: true, highlighted: true });
    chrome.windows.update(windowId, { focused: true });
  },

  query: function(pattern, callback) {
    chrome.tabs.query({ url: pattern }, callback);
  },

  executeScript: function(tabId, script) {
    chrome.tabs.executeScript(tabId, { code: script });
  }

};

module.exports = tabs;
