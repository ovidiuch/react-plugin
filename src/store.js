import { isElement } from 'react-is';
import arrayFindIndex from 'array-find-index';

export function register(pluginDef) {
  const plugin = {
    ...parsePluginDef(pluginDef),
    id: generatePluginId()
  };

  addPlugin(plugin);
  enablePlugin(plugin.id);

  return plugin;
}

export function enablePlugin(pluginId) {
  updatePlugin(pluginId, { enabled: true });
}

export function disablePlugin(pluginId) {
  updatePlugin(pluginId, { enabled: false });
}

export function getPlugins() {
  return getGlobalStore().plugins;
}

export function getEnabledPlugsForSlot(slotName) {
  return getPlugins()
    .filter(plugin => plugin.enabled)
    .reduce(
      (acc, { plugs }) => [
        ...acc,
        ...plugs.filter(plug => plug.slot === slotName)
      ],
      []
    )
    .map(plug => plug.render);
}

// Exported for testing cleanup purposes
export function __reset() {
  global.__REACT_PLUGIN = {
    plugins: [],
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

function parsePluginDef(pluginDef) {
  if (!isElement(pluginDef)) {
    throw new Error('Plugin must be JSX element');
  }

  const { name, children } = pluginDef.props;
  const normalizedChildren = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  normalizedChildren.forEach(child => {
    if (!isElement(child)) {
      throw new Error('Plug must be JSX element');
    }
  });

  return {
    name,
    plugs: normalizedChildren.map(child => {
      const { slot, render } = child.props;

      return {
        slot,
        render
      };
    })
  };
}

function addPlugin(plugin) {
  const store = getGlobalStore();

  store.plugins = [...store.plugins, plugin];
}

function updatePlugin(pluginId, props) {
  const store = getGlobalStore();
  const { plugins } = store;
  const index = arrayFindIndex(plugins, plugin => plugin.id === pluginId);

  if (index !== -1) {
    const plugin = {
      ...plugins[index],
      ...props
    };

    store.plugins = [
      ...plugins.slice(0, index),
      plugin,
      ...plugins.slice(index + 1)
    ];
  }
}

function generatePluginId() {
  const store = getGlobalStore();

  return ++store.lastPluginId;
}
