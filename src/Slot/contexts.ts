import { LinkedItem } from '@skidding/linked-list';
import * as React from 'react';
import { Plug } from '../shared/types';

type SlotContextValue = undefined | LinkedItem<Plug>;

type SlotContexts = {
  [slotName: string]: React.Context<SlotContextValue>;
};

// Slots are nested, so higher-level Slots can contain lower-level Slots.
// Multiple Plugs can be consumed by the same Slot, and the reference to the
// current Plug is is passed down through the Slot context. A different context
// is created for each Slot name to prevent Slots that contain other Slots from
// interfering with each other’s Plug references.
const slotContexts: SlotContexts = {};

export function getSlotContext(slotName: string) {
  if (!slotContexts[slotName]) {
    slotContexts[slotName] = React.createContext<SlotContextValue>(undefined);
  }

  return slotContexts[slotName];
}
