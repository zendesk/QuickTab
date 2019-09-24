var browser = require('./browser.js');

var urlMatch = {

  LOTUS_ROUTE: /^https?:\/\/(.*).zendesk.com\/agent\/(?!chat|voice)\#?\/?(.*)$/,
  TICKET_ROUTE: /^https?:\/\/(.*).zendesk.com\/(?:agent\/tickets|tickets|twickets|requests|hc\/requests)\#?\/?(.*)$/,
  RESTRICTED_ROUTE: /^https?:\/\/(.*).zendesk.com\/(agent\/(chat|talk|admin\/voice)\/?(.*)|tickets\/\d*\/print)/,

  extractMatches: function(url, urlDetection) {
    var matches            = null,
        lotusUrlMatches    = this._getLotusUrlMatches(url),
        ticketUrlMatches   = this._getTicketUrlMatches(url),
        restrictedMatches  = this._checkForRestrictedMatches(url);

    if (!restrictedMatches) {
      if (ticketUrlMatches) {
        matches = ticketUrlMatches;
      } else if (lotusUrlMatches && (urlDetection === 'allUrls')) {
        matches = lotusUrlMatches;
      }
    }

    return matches;
  },

  _getLotusUrlMatches: function(navUrl) {
    var routeDetails    = null,
        matchZendeskUrl = navUrl.match(this.LOTUS_ROUTE);

    if (matchZendeskUrl) {
      routeDetails = this._getRouteDetails(matchZendeskUrl);
      routeDetails.path = '/' + routeDetails.path;
    }

    return routeDetails;
  },

  _getTicketUrlMatches: function(navUrl) {
    var routeDetails    = null,
        matchTicketUrl  = navUrl.match(this.TICKET_ROUTE);

    if (matchTicketUrl) {
      routeDetails = this._getRouteDetails(matchTicketUrl);
      routeDetails.path = '/tickets/' + routeDetails.path;
    }

    return routeDetails;
  },

  _getRouteDetails: function(matchedUrl) {
    var routeDetails = {};

    routeDetails.subdomain = matchedUrl[1];
    routeDetails.path      = matchedUrl[2].replace('#/', '');

    return routeDetails;
  },

  _checkForRestrictedMatches: function(navUrl) {
    var matchesRestrictedUrl = navUrl.match(this.RESTRICTED_ROUTE);

    return (matchesRestrictedUrl) ? true : false;
  }

};

module.exports = urlMatch;
