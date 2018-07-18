import { createContext } from 'react';

const zoneContexts = {};

export function getZoneContext(zoneName) {
  if (!zoneContexts[zoneName]) {
    zoneContexts[zoneName] = createContext(undefined);
  }

  return zoneContexts[zoneName];
}
