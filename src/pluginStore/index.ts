import {
  getLoadedScope,
  getPlugins,
  isPluginLoaded,
  resetPlugins as resetUiPlugins,
  unregisterPlugins as unregisterUiPlugins,
} from 'ui-plugin';
import { IPlug } from '../shared';
import { getGlobalStore } from './global';

export function resetPlugins() {
  resetUiPlugins();
  getGlobalStore().plugs = {};
}

export function unregisterPlugins() {
  unregisterUiPlugins();
  getGlobalStore().plugs = {};
}

export function getLoadedPlugsForSlot(slotName: string) {
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    return [];
  }

  return plugs[slotName].filter(plug => isPluginLoaded(plug.pluginName));
}

export function registerPlug(slotName: string, plug: IPlug) {
  const loadedScope = getLoadedScope();
  const { name: pluginName } = getPlugin(plug.pluginName);

  if (loadedScope && loadedScope.plugins[pluginName]) {
    throw new Error('Registered plug after plugin loaded');
  }

  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push(plug);
}

function getPlugin(pluginName: string) {
  return getPlugins()[pluginName];
}
