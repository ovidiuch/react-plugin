import createLinkedList from '@skidding/linked-list';
import React, { ReactNode } from 'react';
import { PlugConnect } from './PlugConnect';
import { getSlotContext } from './slotContexts';
import { Plug } from './types';
import { useSlotPlugs } from './useSlotPlugs';

type Props = {
  children?: ReactNode;
  name: string;
  slotProps?: object;
};

export function Slot({ children, name, slotProps = {} }: Props) {
  const plugs = useSlotPlugs(name);
  const { Provider, Consumer } = getSlotContext(name);
  return (
    // Children are either
    // - passed to the next plug or,
    // - if this is the last plug for this slot, rendered directly.
    <Consumer>
      {(linkedSlotItem = getFirstLinkedPlug(plugs)) => {
        const { value: plug, next } = linkedSlotItem;

        // All registered plugs for this slot have been rendered (for
        // now). More plugs for this slot can be registered later, which
        // will re-render all plugs from scratch.
        if (!plug) return children;

        return (
          <Provider value={next()}>
            {getPlugNode(plug, slotProps, children)}
          </Provider>
        );
      }}
    </Consumer>
  );
}

function getPlugNode(plug: Plug, slotProps: object, children?: ReactNode) {
  const { pluginName, component } = plug;
  return (
    <PlugConnect
      pluginName={pluginName}
      component={component}
      slotProps={slotProps}
    >
      {children}
    </PlugConnect>
  );
}

function getFirstLinkedPlug(plugs: Plug[]) {
  // Plugs are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugs can go up and down the component hierachy repeatedly, based on the
  // type of each plug and how they end up composing together.
  return createLinkedList(plugs);
}
