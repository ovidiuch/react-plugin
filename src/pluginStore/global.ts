import { IPlugs } from '../shared';

interface IReactPluginStore {
  plugs: IPlugs;
}

declare var global: {
  ReactPluginStore: undefined | IReactPluginStore;
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
