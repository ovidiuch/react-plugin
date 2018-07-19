// TODO: Method for enabling/disabling plugins (How to identify?)
// TODO: Method for subscribing to plugin list

export function register(slotName, element) {
  const slots = getSlots();

  if (!slots[slotName]) {
    slots[slotName] = [];
  }

  slots[slotName].push(element);
}

export function getPluginsForSlot(slotName) {
  const slots = getSlots();

  return slots[slotName];
}

export function __reset() {
  global.__REACT_PLUGIN_ZONES = {};
}

// Slot plugins are shared between multiple code bundles in the same page,
// which is why we're hooking into the global object.
function getSlots() {
  if (!global.__REACT_PLUGIN_ZONES) {
    global.__REACT_PLUGIN_ZONES = {};
  }

  return global.__REACT_PLUGIN_ZONES;
}
