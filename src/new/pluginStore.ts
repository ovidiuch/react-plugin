import { resetPlugins as resetUiPlugins } from 'ui-plugin';
import { getGlobalStore } from './global';
import { IPlug } from './shared';

export function resetPlugins() {
  resetUiPlugins();
  getGlobalStore().plugs = {};
}

export function getPlugs(slotName: string) {
  const { plugs } = getGlobalStore();

  return plugs[slotName];
}

export function addPlug(
  slotName: string,
  { pluginName, render, getProps }: IPlug<any, any, any>,
) {
  const { plugs } = getGlobalStore();

  if (!plugs[slotName]) {
    plugs[slotName] = [];
  }

  plugs[slotName].push({
    pluginName,
    render,
    getProps,
  });
}
