import * as UiPlugin from 'ui-plugin';
import { Plug, Plugs } from './types';

let plugs: Plugs = {};

export function resetPlugins() {
  UiPlugin.resetPlugins();
  plugs = {};
}

export function getEnabledPlugsForSlot(slotName: string) {
  const plugins = UiPlugin.getPlugins();

  if (!plugs[slotName]) {
    return [];
  }

  return plugs[slotName].filter(plug => plugins[plug.pluginName].enabled);
}

export function registerPlug(slotName: string, plug: Plug) {
  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push(plug);
}
