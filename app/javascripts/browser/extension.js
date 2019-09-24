var extension = {
  getUrl: function(file) {
    return chrome.extension.getURL(file);
  }
}

module.exports = extension;
