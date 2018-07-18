// @flow

import React, { Component, createContext } from 'react';
import createLinkedList from '@skidding/linked-list';
import { getPluginsForZone } from './store';

export class Zone extends Component {
  render() {
    const { name, children } = this.props;
    const { Provider, Consumer } = getZoneContext(name);

    const plugins = getPluginsForZone(name);
    if (!plugins) {
      // No plugins are registered for this zone in this render-cycle. Plugins
      // for this zone may be registered later.
      return `[zone '${name}' empty]`;
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
              return `[zone '${name}' end]`;
            }

            return children;
          }

          return (
            <Provider value={next()}>
              {typeof plugin === 'function' ? plugin({ children }) : plugin}
            </Provider>
          );
        }}
      </Consumer>
    );
  }
}

const zoneContexts = {};

function getZoneContext(zoneName) {
  if (!zoneContexts[zoneName]) {
    zoneContexts[zoneName] = createContext(undefined);
  }

  return zoneContexts[zoneName];
}

function getFirstLinkedPlugin(plugins) {
  // TODO: Understand how come both work
  // return createLinkedList([...plugins].reverse());
  return createLinkedList(plugins);
}
