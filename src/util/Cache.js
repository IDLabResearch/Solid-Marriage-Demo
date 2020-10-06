const TTLCache = require("cache");
const DEFAULTTTL = 8 * 1000
var Cache = (function () {
  var instance;

  function createInstance() {
      return new TTLCache(DEFAULTTTL);   
  }

  return {
      getInstance: function () {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      }
  };
})();

export function checkCache(key) {
  return Cache.getInstance().get(key)
}

export function setCache(key, value, ttl) {
  ttl = ttl || DEFAULTTTL;
  return Cache.getInstance().put(key, value, ttl)
}
