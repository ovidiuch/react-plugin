import { Plugs } from '../types';

type ReactPluginStore = { plugs: Plugs };

declare var global: {
  ReactPluginStore: undefined | ReactPluginStore;
};

// Plugins are shared between multiple code bundles that run in the same page
export function getGlobalStore() {
  if (!global.ReactPluginStore) {
    global.ReactPluginStore = {
      plugs: {},
    };
  }

  return global.ReactPluginStore;
}
