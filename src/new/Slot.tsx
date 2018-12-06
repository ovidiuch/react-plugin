import createLinkedList, { LinkedItem } from '@skidding/linked-list';
import * as React from 'react';
import { isValidElementType } from 'react-is';
import { getPluginContext } from 'ui-plugin';
import { getPlugs } from './pluginStore';
import { IPlug } from './shared';

interface IProps {
  name: string;
  children?: React.ReactNode;
  props?: object;
}

export class Slot extends React.Component<IProps> {
  render() {
    const { name, children, props = {} } = this.props;
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
          const { value: plug, next } = linkedSlotItem;

          // All registered plugs for this slot have been rendered (for
          // now). More plugs for this slot can be registered later, which
          // will re-render all plugs from scratch.
          if (!plug) {
            return children;
          }

          const { pluginName, render, getProps } = plug;

          return (
            <Provider value={next()}>
              {isValidElementType(render) && typeof render !== 'string'
                ? React.createElement(
                    render,
                    typeof getProps === 'function'
                      ? getProps(getPluginContext(pluginName), props)
                      : props,
                    children,
                  )
                : render}
            </Provider>
          );
        }}
      </Consumer>
    );
  }
}

type SlotContextValue = undefined | LinkedItem<IPlug<any, any, any>>;

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

function getFirstLinkedPlug(plugs: Array<IPlug<any, any, any>>) {
  // Plugs are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugs can go up and down the component hierachy repeatedly, based on the
  // type of each plug and how they end up composing together.
  return createLinkedList(plugs);
}
