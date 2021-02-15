import * as UiPlugin from 'ui-plugin';
import { PlugComponentType, Plugs } from './shared/types';

let plugId = 0;
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

type RegisterPlugArgs = {
  slotName: string;
  pluginName: string;
  component: PlugComponentType<any, any>;
  plugName?: string;
};

export function registerPlug({
  slotName,
  pluginName,
  component,
  plugName,
}: RegisterPlugArgs) {
  if (!plugs[slotName]) plugs[slotName] = [];

  plugId++;
  plugs[slotName].push({
    id: plugId,
    pluginName,
    component,
    plugName,
  });
}
