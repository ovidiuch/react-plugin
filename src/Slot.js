import { string, node } from 'prop-types';
import React, { Component, createElement, createContext } from 'react';
import { isValidElementType } from 'react-is';
import createLinkedList from '@skidding/linked-list';
import { getEnabledPlugsForSlot } from './store';

export class Slot extends Component {
  static propTypes = {
    name: string.isRequired,
    children: node
  };

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
                ? createElement(plug, { children })
                : plug}
            </Provider>
          );
        }}
      </Consumer>
    );
  }
}

const slotContexts = {};

function getSlotContext(slotName) {
  if (!slotContexts[slotName]) {
    slotContexts[slotName] = createContext(undefined);
  }

  return slotContexts[slotName];
}

function getFirstLinkedPlug(plugs) {
  // Plugs are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugs can go up and down the component hierachy repeatedly, based on the
  // type of each plug and how they end up composing together.
  return createLinkedList(plugs);
}
