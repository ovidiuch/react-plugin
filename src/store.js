// TODO: Method for subscribing to plugin list

export function registerPlugin(pluginDef) {
  const { plugins, enabledPlugins } = getGlobalStore();
  const plugin = {
    ...pluginDef,
    id: generatePluginId()
  };

  plugins.push(plugin);
  // TODO: Add `enabled` bool arg
  enabledPlugins.push(plugin.id);

  return plugin;
}

export function enablePlugin(pluginId) {
  const { enabledPlugins } = getGlobalStore();
  const index = enabledPlugins.indexOf(pluginId);
  if (index === -1) {
    enabledPlugins.push(pluginId);
  }
}

export function disablePlugin(pluginId) {
  const { enabledPlugins } = getGlobalStore();
  const index = enabledPlugins.indexOf(pluginId);

  if (index !== -1) {
    enabledPlugins.splice(index, 1);
  }
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

  return plugins.filter(plugin => enabledPlugins.indexOf(plugin.id) !== -1);
}

// Exported for testing cleanup purposes
export function __reset() {
  global.__REACT_PLUGIN = {
    plugins: [],
    enabledPlugins: [],
    lastPluginId: 0
  };
}

// Plugins are shared between multiple code bundles in the same page, which is
// why we're hooking into the global object.
function getGlobalStore() {
  if (!global.__REACT_PLUGIN) {
    __reset();
  }

  return global.__REACT_PLUGIN;
}

function generatePluginId() {
  const store = getGlobalStore();

  return ++store.lastPluginId;
}
