import React from 'react';
import { registerPlugin, Slot } from '..';

export function Root() {
  return <Slot name="root" />;
}

export function registerPlug(slot, render) {
  registerPlugin({
    plugs: [{ slot, render }]
  });
}
