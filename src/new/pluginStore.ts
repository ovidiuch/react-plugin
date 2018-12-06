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

export function addPlug({ slotName, component, getProps }: ISlotPlug) {
  const { slots } = getGlobalStore();

  if (!slots[slotName]) {
    slots[slotName] = [];
  }

  slots[slotName].push({
    slotName,
    component,
    getProps,
  });
}
