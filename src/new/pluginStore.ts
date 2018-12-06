import { resetPlugins as resetUiPlugins } from 'ui-plugin';
import { getGlobalStore } from './global';
import { ISlotPlug } from './shared';

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
  { pluginName, render, getProps }: ISlotPlug<any, any, any>,
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
