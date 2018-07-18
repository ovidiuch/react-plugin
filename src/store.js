export function registerElement(zoneName, element) {
  const zones = getZones();

  if (!zones[zoneName]) {
    zones[zoneName] = [];
  }

  zones[zoneName].push(element);
}

export function getZoneElements(zoneName) {
  const zones = getZones();

  return zones[zoneName];
}

export function __reset() {
  global.__REACT_PLUGIN_ZONES = {};
}

// Zone elements are shared between multiple code bundles in the same page,
// which is why we're hooking into the global object.
function getZones() {
  if (!global.__REACT_PLUGIN_ZONES) {
    global.__REACT_PLUGIN_ZONES = {};
  }

  return global.__REACT_PLUGIN_ZONES;
}
