import createLinkedList, { LinkedItem } from '@skidding/linked-list';
import * as React from 'react';
import { isValidElementType } from 'react-is';
import { getPlugs } from './pluginStore';
import { ISlotPlug, Renderable } from './shared';

interface IProps {
  name: string;
  children?: React.ReactNode;
}

export class Slot extends React.Component<IProps> {
  render() {
    const { name, children } = this.props;
    const { Provider, Consumer } = getSlotContext(name);

    const plugs = getPlugs(name);
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
        {(linkedSlotItem = getFirstLinkedPlug(plugs)) => {
          const { value, next } = linkedSlotItem;

          // All registered plugs for this slot have been rendered (for
          // now). More plugs for this slot can be registered later, which
          // will re-render all plugs from scratch.
          if (!value) {
            return children;
          }

          return (
            <Provider value={next()}>
              {getElementFromRenderable(value.render, children)}
            </Provider>
          );
        }}
      </Consumer>
    );
  }
}

type SlotContextValue = undefined | LinkedItem<ISlotPlug>;

interface ISlotContexts {
  [slotName: string]: React.Context<SlotContextValue>;
}

const slotContexts: ISlotContexts = {};

function getSlotContext(slotName: string) {
  if (!slotContexts[slotName]) {
    slotContexts[slotName] = React.createContext<SlotContextValue>(undefined);
  }

  return slotContexts[slotName];
}

function getFirstLinkedPlug(plugs: ISlotPlug[]) {
  // Plugs are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugs can go up and down the component hierachy repeatedly, based on the
  // type of each plug and how they end up composing together.
  return createLinkedList(plugs);
}

function getElementFromRenderable(
  render: Renderable<any>,
  children: React.ReactNode,
) {
  return isValidElementType(render) && typeof render !== 'string'
    ? React.createElement(render, { children })
    : render;
}
