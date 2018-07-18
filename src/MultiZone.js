import { Component } from 'react';
import { getZoneElements } from './store';

export class MultiZone extends Component {
  render() {
    const { name, children } = this.props;
    const zoneElements = getZoneElements(name);

    if (!zoneElements) {
      // TODO: Remove error
      throw new Error(`No plugin registered for zone "${name}"`);
    }

    return children(zoneElements);
  }
}
