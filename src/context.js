import { createContext } from 'react';

const slotContexts = {};

export function getSlotContext(slotName) {
  if (!slotContexts[slotName]) {
    slotContexts[slotName] = createContext(undefined);
  }

  return slotContexts[slotName];
}
