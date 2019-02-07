import * as UiPlugin from 'ui-plugin';
import { Plug } from '../types';
import { getGlobalStore } from './global';

export function resetPlugins() {
  UiPlugin.resetPlugins();
  getGlobalStore().plugs = {};
}

export function getEnabledPlugsForSlot(slotName: string) {
  const plugins = UiPlugin.getPlugins();
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    return [];
  }

  return plugs[slotName].filter(plug => plugins[plug.pluginName].enabled);
}

export function registerPlug(slotName: string, plug: Plug) {
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push(plug);
}
