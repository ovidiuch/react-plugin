import * as UiPlugin from 'ui-plugin';
import { Plug, Plugs } from './shared/types';

let plugs: Plugs = {};

export function resetPlugins() {
  UiPlugin.resetPlugins();
  plugs = {};
}

export function getEnabledSlotPlugs(slotName: string) {
  const plugins = UiPlugin.getPlugins();
  return plugs[slotName]
    ? plugs[slotName].filter(plug => plugins[plug.pluginName].enabled)
    : [];
}

export function registerPlug(slotName: string, plug: Plug) {
  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push(plug);
}
