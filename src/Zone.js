// @flow

import React, { Component, createContext } from 'react';
import createLinkedList from '@skidding/linked-list';
import { getZoneElements } from './store';

// TODO: Rename "element" to "plugin"?
export class Zone extends Component {
  render() {
    const { name, children } = this.props;
    const { Provider, Consumer } = getZoneContext(name);

    const zoneElements = getZoneElements(name);
    if (!zoneElements) {
      // No plugins are registered for this zone (yet). Plugins that hook up
      // into this zone can be registered at any point in time.
      return `[zone '${name}' empty]`;
    }

    // Children are either
    // - passed to the next zone element or,
    // - if this is the last plugin for this zone, rendered directly.
    return (
      <Consumer>
        {(zoneEl = getFirstLinkedZoneEl(zoneElements)) => {
          if (!zoneEl.value) {
            if (!children) {
              return `[zone '${name}' end]`;
            }

            return children;
          }

          return (
            <Provider value={zoneEl.next()}>
              {typeof zoneEl.value === 'function'
                ? zoneEl.value({ children })
                : zoneEl.value}
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

function getFirstLinkedZoneEl(zoneElements) {
  // TODO: Understand how come both work
  // return createLinkedList([...zoneElements].reverse());
  return createLinkedList(zoneElements);
}
