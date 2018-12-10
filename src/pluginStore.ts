import { getPlugins, resetPlugins as resetUiPlugins } from 'ui-plugin';
import { getGlobalStore } from './global';
import { IPlug } from './shared';

export function resetPlugins() {
  resetUiPlugins();
  getGlobalStore().plugs = {};
}

export function getPlugs(slotName: string) {
  const { plugs } = getGlobalStore();
  const plugins = getPlugins();

  if (!plugs[slotName]) {
    return [];
  }

  const enabledPluginNames = Object.keys(plugins).filter(
    pluginName => plugins[pluginName].enabled,
  );

  return plugs[slotName].filter(
    plug => enabledPluginNames.indexOf(plug.pluginName) !== -1,
  );
}

export function addPlug(slotName: string, plug: IPlug) {
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push(plug);
}
