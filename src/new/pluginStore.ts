import { resetPlugins as resetUiPlugins } from 'ui-plugin';
import { getGlobalStore } from './global';
import { IPlug } from './shared';

export function resetPlugins() {
  resetUiPlugins();
  getGlobalStore().slots = {};
}

export function getPlugs(slotName: string) {
  const { slots } = getGlobalStore();

  return slots[slotName];
}

export function addPlug(
  slotName: string,
  { pluginName, render, getProps }: IPlug<any, any, any>,
) {
  const { slots } = getGlobalStore();

  if (!slots[slotName]) {
    slots[slotName] = [];
  }

  slots[slotName].push({
    pluginName,
    render,
    getProps,
  });
}
