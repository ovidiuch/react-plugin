export function registerPlugin(zoneName, element) {
  const zones = getZones();

  if (!zones[zoneName]) {
    zones[zoneName] = [];
  }

  zones[zoneName].push(element);
}

export function getPluginsForZone(zoneName) {
  const zones = getZones();

  return zones[zoneName];
}

export function __reset() {
  global.__REACT_PLUGIN_ZONES = {};
}

// Zone plugins are shared between multiple code bundles in the same page,
// which is why we're hooking into the global object.
function getZones() {
  if (!global.__REACT_PLUGIN_ZONES) {
    global.__REACT_PLUGIN_ZONES = {};
  }

  return global.__REACT_PLUGIN_ZONES;
}
