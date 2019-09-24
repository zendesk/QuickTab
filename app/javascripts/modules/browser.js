var urlMatch = require('./url_match.js');

var browser = {

  tabs:       require('../browser/tabs.js'),
  pageAction: require('../browser/page_action.js'),
  i18n:       require('../browser/i18n.js'),
  storage:    require('../browser/storage.js'),
  extension:  require('../browser/extension.js'),

  addPageAction: function(tabId) {
    var detectionMode = this.storage.get('urlDetection'),
        iconState     = (detectionMode !== 'noUrls') ? 'enabled' : 'disabled';

    this.pageAction.show(tabId);
    this.pageAction.setIcon(iconState);
  },

  didNavigate: function(navDetails) {
    var tabDetails       = { id: navDetails.tabId, url: navDetails.url },
        detectionMode    = this.storage.get('urlDetection'),
        zdUrlMatches     = urlMatch.extractMatches(navDetails.url, detectionMode);

    if ((detectionMode !== 'noUrls') && zdUrlMatches) {
      tabDetails.routeDetails = zdUrlMatches;
      browser.openRouteInZendesk(tabDetails);
    }
  },

  didInstall: function(details) {
    var self = this;

    // Find any tabs where the agent interface is open
    self.tabs.query('*://*.zendesk.com/agent/*', function(openTabs) {
      openTabs.forEach(function(tab) {
        self.addPageAction(tab.id);
      });
    });

    // Check if this was first time install
    if (details.reason === 'install') {
      self.openWelcome();
    }

    // Check if the settings we expect exist and set them if not
    self.storage.sanitize();
  },

  openRouteInZendesk: function(tab) {
    var subdomain  = tab.routeDetails.subdomain,
        route      = tab.routeDetails.path,
        self       = this;

    self.tabs.query('*://' + subdomain + '.zendesk.com/agent/*', function(openTabs) {
      var lotusTab = null;

      for (var i = 0, len = openTabs.length; i < len; i++) {
        lotusTab = openTabs[i];

        if (lotusTab.id !== tab.id && lotusTab.url.match(urlMatch.LOTUS_ROUTE)) {
          self.updateLotusRoute(lotusTab.id, route);
          self.tabs.focus(lotusTab);
          self.tabs.remove(tab.id);

          break;
        }
      }
    });
  },

  updateLotusRoute: function(lotusTabId, route) {
    var message       = { "target": "route", "memo": { "hash": route } },
        codeToExecute = "window.postMessage('" + JSON.stringify(message) + "', '*')";

    this.tabs.executeScript(lotusTabId, codeToExecute);
  },

  openWelcome: function() {
    var welcomeUrl = this.extension.getUrl('welcome.html');

    this.tabs.create(welcomeUrl);
  }

};

module.exports = browser;
