export function registerZoneElement(zoneName, element) {
  const zoneElements = getAllZoneElements();

  if (!zoneElements[zoneName]) {
    zoneElements[zoneName] = [];
  }

  zoneElements[zoneName].push(element);
}

export function getZoneElements(zoneName) {
  const allZoneElements = getAllZoneElements();

  return allZoneElements[zoneName];
}

// Zone elements are shared between multiple code bundles in the same page,
// which is why we're hooking into the global object.
function getAllZoneElements() {
  if (!global.__cosmosZoneElements) {
    global.__cosmosZoneElements = {};
  }

  return global.__cosmosZoneElements;
}
