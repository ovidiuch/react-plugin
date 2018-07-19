import { string, node } from 'prop-types';
import React, { Component, createElement } from 'react';
import { isValidElementType } from 'react-is';
import createLinkedList from '@skidding/linked-list';
import { getPluginsForSlot } from './store';
import { getSlotContext } from './context';

export class Slot extends Component {
  static propTypes = {
    name: string,
    children: node
  };

  render() {
    const { name, children } = this.props;
    const { Provider, Consumer } = getSlotContext(name);

    const plugins = getPluginsForSlot(name);
    if (!plugins) {
      // No plugins are registered for this slot in this render-cycle. Plugins
      // for this slot may be registered later.
      return null;
    }

    // Children are either
    // - passed to the next plugin or,
    // - if this is the last plugin for this slot, rendered directly.
    return (
      <Consumer>
        {({ value: plugin, next } = getFirstLinkedPlugin(plugins)) => {
          if (!plugin) {
            if (!children) {
              // All registered plugins for this slot have been rendered (for
              // now). More plugins for this slot can be registered later.
              return null;
            }

            return children;
          }

          return (
            <Provider value={next()}>
              {isValidElementType(plugin) && typeof plugin !== 'string'
                ? createElement(plugin, { children })
                : plugin}
            </Provider>
          );
        }}
      </Consumer>
    );
  }
}

function getFirstLinkedPlugin(plugins) {
  // Plugins are traversed in the order they're applied. But this doesn't mean
  // top-down from a component hierarchy point of view. The traversal of the
  // plugins can go up and down the component hierachy repeatedly, based on the
  // type of each plugin and how they end up composing together.
  return createLinkedList(plugins);
}
