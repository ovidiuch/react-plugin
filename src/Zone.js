// @flow

import React, { Component, createContext } from 'react';
import createLinkedList from '@skidding/linked-list';
import { getZoneElements } from './store';

export class Zone extends Component {
  render() {
    const { name } = this.props;
    const zoneElements = getZoneElements(name);

    if (!zoneElements) {
      throw new Error(`No plugin registered for zone "${name}"`);
    }

    const { Provider, Consumer } = getZoneContext(name);

    return (
      <Consumer>
        {(zoneEl = getFirstLinkedZoneEl(zoneElements)) => {
          if (!zoneEl.value) {
            throw new Error(
              `All plugins for zone "${name}" have been rendered`
            );
          }

          return <Provider value={zoneEl.next()}>{zoneEl.value}</Provider>;
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
  return createLinkedList([...zoneElements].reverse());
}
