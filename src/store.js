export function registerPlugin(pluginDef) {
  const plugin = {
    ...pluginDef,
    id: generatePluginId()
  };

  addPlugin(plugin);
  enablePlugin(plugin.id);

  return plugin;
}

export function enablePlugin(pluginId) {
  const store = getGlobalStore();
  const { enabledPlugins } = store;
  const index = enabledPlugins.indexOf(pluginId);

  if (index === -1) {
    store.enabledPlugins = [...enabledPlugins, pluginId];
  }
}

export function disablePlugin(pluginId) {
  const store = getGlobalStore();
  const { enabledPlugins } = store;
  const index = enabledPlugins.indexOf(pluginId);

  if (index !== -1) {
    store.enabledPlugins = [
      ...enabledPlugins.slice(0, index),
      ...enabledPlugins.slice(index + 1)
    ];
  }
}

export function getEnabledPlugsForSlot(slotName) {
  const enabledPlugins = getPlugins().filter(plugin => plugin.enabled);

  return enabledPlugins
    .reduce(
      (acc, { plugs }) => [
        ...acc,
        ...plugs.filter(plug => plug.slot === slotName)
      ],
      []
    )
    .map(plug => plug.render);
}

export function getPlugins() {
  const { plugins, enabledPlugins } = getGlobalStore();

  return plugins.map(plugin => ({
    ...plugin,
    enabled: enabledPlugins.indexOf(plugin.id) !== -1
  }));
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

function addPlugin(plugin) {
  const store = getGlobalStore();

  store.plugins = [...store.plugins, plugin];
}

function generatePluginId() {
  const store = getGlobalStore();

  return ++store.lastPluginId;
}
