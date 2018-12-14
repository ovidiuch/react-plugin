import {
  getLoadedScope,
  getPlugins,
  isPluginLoaded,
  PluginId,
  resetPlugins as resetUiPlugins,
} from 'ui-plugin';
import { IPlug } from '../shared';
import { getGlobalStore } from './global';

export function resetPlugins() {
  resetUiPlugins();
  getGlobalStore().plugs = {};
}

export function getLoadedPlugsForSlot(slotName: string) {
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    return [];
  }

  return plugs[slotName].filter(plug =>
    isPluginLoaded(getPluginById(plug.pluginId)),
  );
}

export function registerPlug(slotName: string, plug: IPlug) {
  const loadedScope = getLoadedScope();
  const { name: pluginName } = getPluginById(plug.pluginId);

  if (
    loadedScope &&
    loadedScope.plugins[pluginName] &&
    loadedScope.plugins[pluginName].id === plug.pluginId
  ) {
    throw new Error('Registered plug after plugin loaded');
  }

  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push(plug);
}

function getPluginById(pluginId: PluginId) {
  return getPlugins()[pluginId];
}
