import { IPlugs } from './shared';

interface IReactGlobalStore {
  plugs: IPlugs;
}

declare var global: {
  ReactPlugin: undefined | IReactGlobalStore;
};

// Plugins are shared between multiple code bundles that run in the same page
export function getGlobalStore() {
  if (!global.ReactPlugin) {
    global.ReactPlugin = {
      plugs: {},
    };
  }

  return global.ReactPlugin;
}
