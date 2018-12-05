import createLinkedList from '@skidding/linked-list';
import * as React from 'react';
import { isValidElementType } from 'react-is';
import { getEnabledPlugsForSlot, NodeOrComponent } from './store';

interface IProps {
  name: string;
  children?: React.ReactNode;
}

export class Slot extends React.Component<IProps> {
  render() {
    const { name, children } = this.props;
    const { Provider, Consumer } = getSlotContext(name);

    const plugs = getEnabledPlugsForSlot(name);
    if (!plugs) {
      // No plugs are registered for this slot in this render-cycle. Plugs
      // for this slot may be registered later.
      return null;
    }

    // Children are either
    // - passed to the next plug or,
    // - if this is the last plug for this slot, rendered directly.
    return (
      <Consumer>
        {({ value: plug, next } = getFirstLinkedPlug(plugs)) => {
          if (!plug) {
            if (!children) {
              // All registered plugs for this slot have been rendered (for
              // now). More plugs for this slot can be registered later.
              return null;
            }

            return children;
          }

          return (
            <Provider value={next()}>
              {isValidElementType(plug) && typeof plug !== 'string'
                ? React.createElement(plug, { children })
                : plug}
            </Provider>
          );
        }}
      </Consumer>
    );
  }
}

const slotContexts: {
  [slotName: string]: React.Context<any>;
} = {};

function getSlotContext(slotName: string) {
  if (!slotContexts[slotName]) {
    slotContexts[slotName] = React.createContext(undefined);
  }

  return slotContexts[slotName];
}

function getFirstLinkedPlug(plugs: NodeOrComponent[]) {
  // Plugs are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugs can go up and down the component hierachy repeatedly, based on the
  // type of each plug and how they end up composing together.
  return createLinkedList(plugs);
}
