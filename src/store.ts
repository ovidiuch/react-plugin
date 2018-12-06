// @ts-ignore
import * as arrayFindIndex from 'array-find-index';
import * as React from 'react';
import { isElement } from 'react-is';

export type PluginId = number;

export type NodeOrComponent = React.ReactNode | React.ComponentType;

interface IPlug {
  slot: string;
  render: NodeOrComponent;
}

export interface IPlugin {
  id: PluginId;
  name: string;
  enabled: boolean;
  plugs: IPlug[];
}

export type IPlugDef = React.ReactElement<IPlug>;

export type IPluginDef = React.ReactElement<{
  name: string;
  children?: IPlugDef | IPlugDef[];
}>;

export function register(pluginDef: IPluginDef) {
  const plugin = {
    ...parsePluginDef(pluginDef),
    id: generatePluginId(),
    enabled: true,
  };

  addPlugin(plugin);
  enablePlugin(plugin.id);

  return plugin;
}

export function enablePlugin(pluginId: PluginId) {
  updatePlugin(pluginId, { enabled: true });
}

export function disablePlugin(pluginId: PluginId) {
  updatePlugin(pluginId, { enabled: false });
}

export function getPlugins() {
  return getGlobalStore().plugins;
}

export function getEnabledPlugsForSlot(slotName: string): NodeOrComponent[] {
  return getPlugins()
    .filter(plugin => plugin.enabled)
    .reduce(
      (acc: IPlug[], { plugs }) => [
        ...acc,
        ...plugs.filter(plug => plug.slot === slotName),
      ],
      [],
    )
    .map(plug => plug.render);
}

declare var global: {
  __REACT_PLUGIN: {
    plugins: IPlugin[];
    lastPluginId: PluginId;
  };
};

// Exported for testing cleanup purposes
export function __reset() {
  global.__REACT_PLUGIN = {
    plugins: [],
    lastPluginId: 0,
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

function parsePluginDef(pluginDef: IPluginDef) {
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
        render,
      };
    }),
  };
}

function addPlugin(plugin: IPlugin) {
  const store = getGlobalStore();

  store.plugins = [...store.plugins, plugin];
}

function updatePlugin(pluginId: PluginId, props: object) {
  const store = getGlobalStore();
  const { plugins } = store;
  const index = arrayFindIndex(
    plugins,
    (plugin: IPlugin) => plugin.id === pluginId,
  );

  if (index !== -1) {
    const plugin = {
      ...plugins[index],
      ...props,
    };

    store.plugins = [
      ...plugins.slice(0, index),
      plugin,
      ...plugins.slice(index + 1),
    ];
  }
}

function generatePluginId() {
  const store = getGlobalStore();

  return ++store.lastPluginId;
}
