import { registerPlugin } from '..';

// TODO: Remove this
export function registerPlug(slot, render) {
  registerPlugin({
    plugs: [{ slot, render }]
  });
}
