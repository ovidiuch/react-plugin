// TODO: Method for enabling/disabling plugins
// TODO: Method for subscribing to plugin list

// TODO: Add pluginId
// TODO: Add autoEnable arg
export function registerPlugin(pluginDef) {
  const { plugins, enabledPlugins } = getGlobalStore();
  plugins.push(pluginDef);
  enabledPlugins.push(pluginDef.name);
}

export function getEnabledPlugsForSlot(slotName) {
  const enabledPlugins = getEnabledPlugins();

  return enabledPlugins
    .reduce(
      (acc, next) => [
        ...acc,
        ...next.plugs.filter(plug => plug.slot === slotName)
      ],
      []
    )
    .map(plug => plug.render);
}

function getEnabledPlugins() {
  const { plugins, enabledPlugins } = getGlobalStore();

  return plugins.filter(plugin => enabledPlugins.indexOf(plugin.name) !== -1);
}

// Exported for testing cleanup purposes
export function __reset() {
  global.__REACT_PLUGIN = { plugins: [], enabledPlugins: [] };
}

// Plugins are shared between multiple code bundles in the same page, which is
// why we're hooking into the global object.
function getGlobalStore() {
  if (!global.__REACT_PLUGIN) {
    __reset();
  }

  return global.__REACT_PLUGIN;
}
