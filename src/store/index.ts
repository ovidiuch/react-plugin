import { getPlugins, resetPlugins as resetUiPlugins } from 'ui-plugin';
import { IPlug } from '../types';
import { getGlobalStore } from './global';

export function resetPlugins() {
  resetUiPlugins();
  getGlobalStore().plugs = {};
}

export function getEnabledPlugsForSlot(slotName: string) {
  const plugins = getPlugins();
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    return [];
  }

  return plugs[slotName].filter(plug => plugins[plug.pluginName].enabled);
}

export function registerPlug(slotName: string, plug: IPlug) {
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push(plug);
}
