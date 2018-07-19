import React, { Component, createElement, createContext } from 'react';
import { isValidElementType } from 'react-is';
import createLinkedList from '@skidding/linked-list';
import { getPluginsForZone } from './store';
import { getZoneContext } from './context';

export class Zone extends Component {
  render() {
    const { name, children } = this.props;
    const { Provider, Consumer } = getZoneContext(name);

    const plugins = getPluginsForZone(name);
    if (!plugins) {
      // No plugins are registered for this zone in this render-cycle. Plugins
      // for this zone may be registered later.
      return null;
    }

    // Children are either
    // - passed to the next plugin or,
    // - if this is the last plugin for this zone, rendered directly.
    return (
      <Consumer>
        {({ value: plugin, next } = getFirstLinkedPlugin(plugins)) => {
          if (!plugin) {
            if (!children) {
              // All registered plugins for this zone have been rendered (for
              // now). More plugins for this zone can be registered later.
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
