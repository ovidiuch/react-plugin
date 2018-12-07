import { LinkedItem } from '@skidding/linked-list';
import * as React from 'react';
import { IPlug } from '../shared';

type SlotContextValue = undefined | LinkedItem<IPlug>;

interface ISlotContexts {
  [slotName: string]: React.Context<SlotContextValue>;
}

const slotContexts: ISlotContexts = {};

export function getSlotContext(slotName: string) {
  if (!slotContexts[slotName]) {
    slotContexts[slotName] = React.createContext<SlotContextValue>(undefined);
  }

  return slotContexts[slotName];
}
