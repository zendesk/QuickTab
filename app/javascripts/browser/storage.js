var storage = {
  get: function(key) {
    return localStorage.getItem(key);
  },

  set: function(key, value) {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  },

  drop: function() {
    localStorage.clear();
  },

  sanitize: function() {
    if (!this.get('urlDetection')) {
      this.set('urlDetection', 'allUrls');
    }
  }
};

module.exports = storage;
