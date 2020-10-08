const TTLCache = require("cache");
const DEFAULTTTL = 5 * 1000
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
      },
      reset: function() {
        instance = createInstance();
      }
  };
})();

export function checkCache(key) {
  const cache = Cache.getInstance();
  return cache && cache.get(key)
}

export function setCache(key, value, ttl) {
  const cache = Cache.getInstance();
  ttl = ttl || DEFAULTTTL;
  return cache && cache.put(key, value, ttl)
}


export function delCache(key) {
  const cache = Cache.getInstance();
  return cache && cache.del(key)
}

export function clearCache(){
  Cache.reset();
}
