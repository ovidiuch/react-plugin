import { registerPlugin } from '../';

export function registerPlug(slot, render) {
  registerPlugin({
    plugs: [{ slot, render }]
  });
}
