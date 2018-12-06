import { ISlots } from './shared';

interface IReactGlobalStore {
  slots: ISlots;
}

declare var global: {
  ReactPlugin: undefined | IReactGlobalStore;
};

// Plugins are shared between multiple code bundles that run in the same page
export function getGlobalStore() {
  if (!global.ReactPlugin) {
    global.ReactPlugin = {
      slots: {},
    };
  }

  return global.ReactPlugin;
}
